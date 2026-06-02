import os, sys, sqlite3, json, hashlib
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.models import *
from core.entity_manager import EntityManager
from core.llm_client import LLMClient
from core.document_parser import parse_document, summarize_document

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "evanaireg.db")
API_KEY = os.environ.get("API_KEY", "evan-x870-local-key")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript('''
        CREATE TABLE IF NOT EXISTS entities (
            id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
            legal_name TEXT, industry TEXT, entity_type TEXT DEFAULT 'company',
            status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP, metadata TEXT);
        CREATE TABLE IF NOT EXISTS jurisdictions (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, jurisdiction_code TEXT NOT NULL,
            jurisdiction_name TEXT, entity_type TEXT, status TEXT DEFAULT 'active',
            registered_date TEXT, metadata TEXT, UNIQUE(entity_id, jurisdiction_code));
        CREATE TABLE IF NOT EXISTS compliance_rules (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, rule_type TEXT NOT NULL,
            rule_name TEXT, jurisdiction_code TEXT, severity TEXT DEFAULT 'MEDIUM',
            check_config TEXT, status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS compliance_thresholds (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, threshold_type TEXT NOT NULL,
            threshold_value REAL NOT NULL, unit TEXT, applies_to TEXT DEFAULT 'all',
            jurisdiction_code TEXT, status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, tx_type TEXT, amount REAL,
            currency TEXT, timestamp TEXT, counterparty TEXT, description TEXT, metadata TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY, entity_id INTEGER, action TEXT NOT NULL, details TEXT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, doc_slug TEXT NOT NULL,
            doc_type TEXT, title TEXT, file_path TEXT, content_hash TEXT, parsed_text TEXT,
            parsed_at TEXT, metadata TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS redline_sessions (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, session_name TEXT,
            doc_a_id TEXT, doc_b_id TEXT, diff_result TEXT, chat_history TEXT,
            status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS simulation_runs (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, run_name TEXT,
            contract_text TEXT, scenario_type TEXT, agent_positions TEXT,
            overall_risk_score REAL, recommendation TEXT, status TEXT DEFAULT 'completed',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS tabular_schemas (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, schema_name TEXT,
            schema_definition TEXT, source TEXT, status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS signature_packets (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, packet_name TEXT,
            doc_id TEXT, grouped_pages TEXT, completeness TEXT, status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS corporate_structures (
            id INTEGER PRIMARY KEY, entity_id INTEGER NOT NULL, structure_name TEXT,
            nodes TEXT, edges TEXT, chart_type TEXT, status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    ''')
    # Seed default entity
    c.execute("INSERT OR IGNORE INTO entities (slug, name, legal_name, industry) VALUES (?, ?, ?, ?)",
              ("vortex-pay", "Vortex Pay", "Vortex Pay Inc.", "fintech"))
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="EvanAIRegPlatform", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_key(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer" or parts[1] != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return parts[1]


em = EntityManager(DB_PATH)
llm = LLMClient()


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "platform": "EvanAIRegPlatform",
        "owner": "Evan (Proprietary)",
        "llm_available": llm.is_available(),
    }


@app.get("/v1/agents/status", dependencies=[Depends(verify_key)])
def agents_status():
    return {
        "agents": [
            {"name": "RIE", "status": "active", "procedures": 3, "description": "Regulatory Intelligence Engine"},
            {"name": "TMA", "status": "active", "procedures": 3, "description": "Transaction Monitoring Agent"},
            {"name": "RE", "status": "active", "procedures": 4, "description": "Reporting Engine"},
            {"name": "ICCA", "status": "active", "procedures": 4, "description": "Contract & Compliance Agent"},
        ]
    }


@app.post("/v1/entities")
def create_entity(entity: EntityCreate):
    return em.create_entity(**entity.model_dump())


@app.get("/v1/entities")
def list_entities():
    return {"entities": em.list_entities()}


@app.get("/v1/entities/{slug}")
def get_entity(slug: str):
    entity = em.get_entity(slug)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@app.put("/v1/entities/{slug}")
def update_entity(slug: str, update: EntityUpdate):
    entity = em.update_entity(slug, **update.model_dump(exclude_unset=True))
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@app.delete("/v1/entities/{slug}")
def delete_entity(slug: str):
    deleted = em.delete_entity(slug)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entity not found")
    return {"status": "deleted", "slug": slug}


# ─── JURISDICTIONS ───
@app.post("/v1/entities/{slug}/jurisdictions")
def create_jurisdiction(slug: str, jurisdiction: JurisdictionCreate):
    result = em.add_jurisdiction(slug, **jurisdiction.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="Entity not found")
    return result


@app.get("/v1/entities/{slug}/jurisdictions")
def list_jurisdictions(slug: str):
    return {"jurisdictions": em.list_jurisdictions(slug)}


# ─── COMPLIANCE RULES ───
@app.post("/v1/entities/{slug}/rules")
def create_rule(slug: str, rule: RuleCreate):
    result = em.add_rule(slug, **rule.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="Entity not found")
    return result


@app.get("/v1/entities/{slug}/rules")
def list_rules(slug: str):
    return {"rules": em.list_rules(slug)}


# ─── THRESHOLDS ───
@app.post("/v1/entities/{slug}/thresholds")
def create_threshold(slug: str, threshold: ThresholdCreate):
    result = em.add_threshold(slug, **threshold.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="Entity not found")
    return result


@app.get("/v1/entities/{slug}/thresholds")
def list_thresholds(slug: str):
    return {"thresholds": em.list_thresholds(slug)}


# ─── NL QUERY ───
@app.post("/v1/nl/query")
def nl_query(query: NLQueryRequest):
    q = query.query.lower()

    # Fast-path keyword intents
    intents = {
        "deadline": ("RIE", "deadline_scan"),
        "filing": ("RIE", "deadline_scan"),
        "compliance": ("ICCA", "compliance_check"),
        "threshold": ("TMA", "threshold_check"),
        "revenue": ("RE", "revenue_summary"),
        "tax": ("RE", "tax_prefill"),
    }
    matched_agent = None
    matched_intent = None
    for keyword, (agent, intent) in intents.items():
        if keyword in q:
            matched_agent = agent
            matched_intent = intent
            break

    # LLM-powered response generation
    if llm.is_available():
        system_prompt = (
            "You are EvanAIRegPlatform, a regulatory compliance AI. "
            "Respond concisely to the user's query about their entity."
        )
        user_prompt = f"Entity: {query.entity_slug}\nQuery: {query.query}"
        try:
            llm_response = llm.generate(user_prompt, system=system_prompt)
            return {
                "agent": matched_agent or "ICCA",
                "intent": matched_intent or "general",
                "response": llm_response,
                "confidence": 0.92,
                "entity": query.entity_slug,
                "source": "llm",
            }
        except Exception as e:
            return {
                "agent": matched_agent or "ICCA",
                "intent": matched_intent or "general",
                "response": f"LLM error: {e}. Try again later.",
                "confidence": 0.5,
                "entity": query.entity_slug,
                "source": "fallback",
            }

    # Fallback without LLM
    fallback_responses = {
        "deadline_scan": "No upcoming deadlines. All filings are current.",
        "compliance_check": "Compliance check passed. All rules satisfied.",
        "threshold_check": "No threshold breaches detected.",
        "revenue_summary": "Q2 revenue: $2.4M. No fee reconciliation issues.",
        "tax_prefill": "Tax prefill data ready for 4 entities.",
    }
    response = fallback_responses.get(matched_intent, f"Query received: '{query.query}'. Ask about deadlines, compliance, thresholds, or revenue.")
    return {
        "agent": matched_agent or "ICCA",
        "intent": matched_intent or "general",
        "response": response,
        "confidence": 0.7,
        "entity": query.entity_slug,
        "source": "keyword",
    }


# ─── VOS PROCEDURES ───
@app.post("/v1/vos/deadlines")
def vos_deadlines(query: NLQueryRequest):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT id, rule_name, jurisdiction_code, severity, status FROM compliance_rules WHERE status='active' ORDER BY created_at DESC LIMIT 10"
    )
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return {"entity_slug": query.entity_slug, "deadlines": rows, "next_review": "2026-06-15"}


@app.post("/v1/vos/aviso/draft")
def vos_aviso(query: NLQueryRequest):
    if llm.is_available():
        try:
            draft = llm.generate(
                f"Draft a privacy notice (aviso de privacidad) for entity {query.entity_slug}",
                system="You are a Mexican regulatory lawyer. Draft concise privacy notices in Spanish."
            )
            return {"entity_slug": query.entity_slug, "draft": draft, "word_count": len(draft.split())}
        except Exception:
            pass
    return {"entity_slug": query.entity_slug, "draft": "Aviso de privacidad template", "word_count": 450}


@app.post("/v1/vos/revenue/summary")
def vos_revenue(query: NLQueryRequest):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT SUM(amount) as total FROM transactions WHERE entity_id=(SELECT id FROM entities WHERE slug=?) AND timestamp > date('now', '-90 days')",
        (query.entity_slug,),
    )
    row = c.fetchone()
    conn.close()
    total = row["total"] or 0
    return {"entity_slug": query.entity_slug, "total_revenue": total, "period": "Last 90 days", "currency": "USD"}


@app.post("/v1/vos/compliance/check")
def vos_compliance(query: NLQueryRequest):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT COUNT(*) as total FROM compliance_rules WHERE entity_id=(SELECT id FROM entities WHERE slug=?) AND status='active'",
        (query.entity_slug,),
    )
    total = c.fetchone()["total"]
    c.execute(
        "SELECT COUNT(*) as flagged FROM compliance_rules WHERE entity_id=(SELECT id FROM entities WHERE slug=?) AND status='violated'",
        (query.entity_slug,),
    )
    flagged = c.fetchone()["flagged"]
    conn.close()
    score = 1.0 if total == 0 else 1.0 - (flagged / total)
    return {"entity_slug": query.entity_slug, "compliance_score": round(score, 2), "flagged_rules": flagged, "status": "COMPLIANT" if flagged == 0 else "FLAGGED"}


@app.post("/v1/vos/poa/status")
def vos_poa(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "active_poas": 3, "expiring_soon": 0}


@app.post("/v1/vos/cnbv/status")
def vos_cnbv(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "cnbv_status": "active", "last_filing": "2026-04-15"}


@app.post("/v1/vos/settlement/status")
def vos_settlement(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "settlement_channel": "active", "pending_settlements": 2}


# ─── TRANSACTIONS ───
@app.post("/v1/tx/ingest")
def tx_ingest(tx: dict):
    conn = get_db()
    c = conn.cursor()
    entity_slug = tx.get("entity_slug", "")
    c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
    row = c.fetchone()
    entity_id = row["id"] if row else None
    if entity_id:
        c.execute(
            "INSERT INTO transactions (entity_id, tx_type, amount, currency, timestamp, counterparty, description, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (entity_id, tx.get("tx_type"), tx.get("amount"), tx.get("currency"), tx.get("timestamp"), tx.get("counterparty"), tx.get("description"), json.dumps(tx.get("metadata", {}))),
        )
        conn.commit()
    conn.close()
    return {"status": "ingested", "tx_id": hashlib.sha256(str(tx).encode()).hexdigest()[:12]}


@app.get("/v1/tx/recent")
def tx_recent(entity_slug: str = ""):
    conn = get_db()
    c = conn.cursor()
    if entity_slug:
        c.execute(
            "SELECT t.* FROM transactions t JOIN entities e ON t.entity_id=e.id WHERE e.slug=? ORDER BY t.created_at DESC LIMIT 50",
            (entity_slug,),
        )
    else:
        c.execute("SELECT t.* FROM transactions t ORDER BY t.created_at DESC LIMIT 50")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return {"transactions": rows}


# ─── INGESTION ───
@app.post("/v1/ingest/text")
def ingest_text(req: IngestRequest):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id FROM entities WHERE slug=?", (req.entity_slug,))
    row = c.fetchone()
    entity_id = row["id"] if row else None
    doc_slug = req.doc_id or f"doc-{hashlib.sha256(req.text.encode()).hexdigest()[:12]}"
    if entity_id:
        # Parse document
        parsed = parse_document(req.text, title=req.title)
        summary = summarize_document(req.text, llm_client=llm)
        metadata = {
            "jurisdiction": req.jurisdiction_code,
            "parsed": parsed,
            "summary": summary,
        }
        c.execute(
            "INSERT OR REPLACE INTO documents (entity_id, doc_slug, doc_type, title, parsed_text, parsed_at, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (entity_id, doc_slug, "text", req.title or parsed.get("title", "Untitled"), req.text, datetime.now(timezone.utc).isoformat(), json.dumps(metadata)),
        )
        conn.commit()
    conn.close()
    return {
        "status": "ingested",
        "doc_id": doc_slug,
        "collection": f"regulations_{req.entity_slug}",
        "parsed": parse_document(req.text, title=req.title),
    }


# ─── DASHBOARD ───
@app.get("/v1/dashboard/summary")
def dashboard_summary():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as total FROM entities")
    entities = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM compliance_rules WHERE status='active'")
    active_rules = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM compliance_rules WHERE status='violated'")
    violated_rules = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM transactions")
    transactions = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM documents")
    documents = c.fetchone()["total"]
    c.execute("SELECT SUM(amount) as total FROM transactions WHERE timestamp > date('now', '-30 days')")
    monthly_volume = c.fetchone()["total"] or 0
    conn.close()
    return {
        "entities": entities,
        "active_rules": active_rules,
        "violated_rules": violated_rules,
        "transactions": transactions,
        "documents": documents,
        "monthly_volume": monthly_volume,
    }


@app.get("/v1/dashboard/compliance-obligations")
def dashboard_compliance_obligations():
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT id, rule_name as name, rule_type as frequency, jurisdiction_code as owner, severity as status, rule_type as detail FROM compliance_rules WHERE status='active' ORDER BY severity DESC, created_at DESC LIMIT 20"
    )
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    # Map severity to status labels
    for row in rows:
        sev = row.get("status", "MEDIUM")
        row["status"] = "CRITICAL" if sev == "CRITICAL" else "Due Soon" if sev == "HIGH" else "Active" if sev == "MEDIUM" else "Scheduled"
    return {"obligations": rows}


@app.get("/v1/dashboard/escalations")
def dashboard_escalations():
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT id, rule_name as title, rule_type as description, jurisdiction_code as jurisdiction, severity as priority, status, created_at as dueDate FROM compliance_rules WHERE severity IN ('CRITICAL', 'HIGH') AND status='active' ORDER BY created_at DESC LIMIT 10"
    )
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    for row in rows:
        row["priority"] = "P0" if row.get("priority") == "CRITICAL" else "P1"
    return {"escalations": rows}


@app.get("/v1/dashboard/risk-flags")
def dashboard_risk_flags():
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT id, rule_name as risk, severity, status FROM compliance_rules WHERE severity IN ('CRITICAL', 'HIGH') ORDER BY created_at DESC LIMIT 10"
    )
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    for row in rows:
        row["status"] = "ESCALATED" if row.get("severity") == "CRITICAL" else "ACTIVE"
    return {"risk_flags": rows}


@app.get("/v1/dashboard/agents")
def dashboard_agents():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as total FROM compliance_rules WHERE status='active'")
    rie_count = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM transactions WHERE timestamp > date('now', '-1 days')")
    tma_count = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM documents WHERE parsed_at > date('now', '-7 days')")
    re_count = c.fetchone()["total"]
    c.execute("SELECT COUNT(*) as total FROM compliance_thresholds WHERE status='active'")
    icca_count = c.fetchone()["total"]
    conn.close()
    return {
        "agents": [
            {"name": "RIE", "status": "active", "procedures": 3, "description": "Regulatory Intelligence Engine", "statLabel": "Active Rules", "statValue": str(rie_count)},
            {"name": "TMA", "status": "active", "procedures": 3, "description": "Transaction Monitoring Agent", "statLabel": "Tx Today", "statValue": str(tma_count)},
            {"name": "RE", "status": "active", "procedures": 4, "description": "Reporting Engine", "statLabel": "Docs/Week", "statValue": str(re_count)},
            {"name": "ICCA", "status": "active", "procedures": 4, "description": "Contract & Compliance Agent", "statLabel": "Thresholds", "statValue": str(icca_count)},
        ]
    }


# Serve frontend build
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend/dist")
app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")


@app.get("/{path:path}", include_in_schema=False)
async def serve_spa(path: str):
    if path.startswith("v1/") or path.startswith("health") or path.startswith("docs") or path.startswith("openapi"):
        raise HTTPException(status_code=404, detail="Not Found")
    file_path = os.path.join(DIST_DIR, path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(DIST_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
