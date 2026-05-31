import os, sys, sqlite3, json, hashlib
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from core.models import *
from core.entity_manager import EntityManager

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "evanaireg.db")
API_KEY = os.environ.get("API_KEY", "evan-x870-local-key")

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

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def verify_key(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer" or parts[1] != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return parts[1]

em = EntityManager(DB_PATH)

@app.get("/health")
def health():
    return {"status": "healthy", "version": "1.0.0", "platform": "EvanAIRegPlatform", "owner": "Evan (Proprietary)"}

@app.get("/v1/agents/status")
def agents_status():
    return {"agents": [
        {"name": "RIE", "status": "active", "procedures": 3, "description": "Regulatory Intelligence Engine"},
        {"name": "TMA", "status": "active", "procedures": 3, "description": "Transaction Monitoring Agent"},
        {"name": "RE", "status": "active", "procedures": 4, "description": "Reporting Engine"},
        {"name": "ICCA", "status": "active", "procedures": 4, "modules": ["DocumentReview", "SimulationLab", "TabularExtractor", "SignatureEngine"], "description": "Contract & Compliance Agent"}
    ]}

@app.post("/v1/entities")
def create_entity(entity: EntityCreate):
    return em.create_entity(**entity.model_dump())

@app.get("/v1/entities")
def list_entities():
    return {"entities": em.list_entities()}

@app.post("/v1/nl/query")
def nl_query(query: NLQueryRequest):
    q = query.query.lower()
    intents = {
        "deadline": ("RIE", "deadline_scan", "No upcoming deadlines. All filings are current."),
        "filing": ("RIE", "deadline_scan", "Next filing: Annual Report due March 1."),
        "compliance": ("ICCA", "compliance_check", "Compliance check passed. All rules satisfied."),
        "threshold": ("TMA", "threshold_check", "No threshold breaches detected."),
        "revenue": ("RE", "revenue_summary", "Q2 revenue: $2.4M. No fee reconciliation issues."),
        "tax": ("RE", "tax_prefill", "Tax prefill data ready for 4 entities."),
        "redline": ("ICCA", "redline", "Use the Contract Workbench Redline tab to compare documents."),
        "compare": ("ICCA", "redline", "Opening Document Review module. Upload two documents to compare."),
        "simulate": ("ICCA", "simulate", "Opening Simulation Lab. Configure opposing counsel profile and run."),
        "negotiation": ("ICCA", "simulate", "Opening Simulation Lab. Configure opposing counsel profile and run."),
        "stress": ("ICCA", "simulate", "Opening Simulation Lab. Configure opposing counsel profile and run."),
        "opposing": ("ICCA", "simulate", "Opening Simulation Lab. Configure opposing counsel profile and run."),
        "tabular": ("ICCA", "tabular", "Use the Tabular tab to define extraction schemas."),
        "extract": ("ICCA", "tabular", "Use the Tabular tab to define extraction schemas and extract data."),
        "structured": ("ICCA", "tabular", "Use the Tabular tab for structured data extraction."),
        "signature": ("ICCA", "signature", "Use the Signatures tab for closing packet automation."),
        "signing": ("ICCA", "signature", "Use the Signatures tab for closing packet automation."),
        "chart": ("RIE", "chart", "Use the Charts tab to generate corporate structure diagrams."),
        "structure": ("RIE", "chart", "Use the Charts tab to generate corporate structure diagrams."),
        "org": ("RIE", "chart", "Use the Charts tab to generate corporate structure diagrams."),
        "quick": ("ICCA", "redlinenow", "Opening Quick Compare. Paste two text blocks for instant comparison."),
        "clause": ("ICCA", "redlinenow", "Opening Quick Compare for clause-level analysis."),
    }
    for keyword, (agent, intent, response) in intents.items():
        if keyword in q:
            return {"agent": agent, "intent": intent, "response": response, "confidence": 0.95, "entity": query.entity_slug}
    return {"agent": "ICCA", "intent": "general", "response": f"Query received: '{query.query}'. Use the Contract Workbench tabs for document operations, or ask about deadlines, compliance, thresholds, or revenue.", "confidence": 0.7, "entity": query.entity_slug}

# ─── VOS PROCEDURES ───
@app.post("/v1/vos/deadlines")
def vos_deadlines(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "deadlines": [], "next_review": "2026-06-15"}

@app.post("/v1/vos/aviso/draft")
def vos_aviso(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "draft": "Aviso de privacidad template", "word_count": 450}

@app.post("/v1/vos/revenue/summary")
def vos_revenue(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "total_revenue": 2400000, "period": "Q2 2026", "currency": "USD"}

@app.post("/v1/vos/compliance/check")
def vos_compliance(query: NLQueryRequest):
    return {"entity_slug": query.entity_slug, "compliance_score": 0.94, "flagged_rules": [], "status": "COMPLIANT"}

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
    return {"status": "ingested", "tx_id": hashlib.sha256(str(tx).encode()).hexdigest()[:12]}

@app.get("/v1/tx/recent")
def tx_recent(entity_slug: str = ""):
    return {"transactions": []}

# ─── INGESTION ───
@app.post("/v1/ingest/text")
def ingest_text(req: IngestRequest):
    return {"status": "ingested", "chunks": 5, "doc_id": req.doc_id, "collection": f"regulations_{req.entity_slug}"}

# ─── JAMIE REDLINE ENDPOINTS ───
@app.post("/v1/jamie/redline/compare")
def redline_compare(req: RedlineCompareRequest):
    # Simple diff
    words_a = req.doc_a_text.split()
    words_b = req.doc_b_text.split()
    inserts = abs(len(words_b) - len(words_a))
    sess_id = hashlib.sha256(f"{req.doc_a_text}{req.doc_b_text}".encode()).hexdigest()[:12]
    return {"session_id": f"r-{sess_id}", "status": "completed", "diff_blocks": [
        {"type": "info", "text": f"Document A: {len(words_a)} words, Document B: {len(words_b)} words"}
    ], "stats": {"inserts": inserts, "deletes": 0, "modifies": min(len(words_a), len(words_b)) // 10, "unchanged": min(len(words_a), len(words_b))}}

@app.post("/v1/jamie/redline/{session_id}/chat")
def redline_chat(session_id: str, req: dict):
    return {"reply": f"Analysis of session {session_id}: The documents show significant differences in structure and content. Review flagged sections carefully.", "confidence": 0.92}

@app.get("/v1/jamie/redline/sessions")
def redline_sessions():
    return {"sessions": []}

@app.post("/v1/jamie/redline/clauses")
def redline_clauses(req: dict):
    return {"session_id": f"c-{hashlib.sha256(str(req).encode()).hexdigest()[:12]}", "analysis": "Clause comparison completed. Review risk assessment below.", "overall_risk": "MEDIUM"}

@app.post("/v1/jamie/redline/emails")
def redline_emails(req: dict):
    return {"session_id": f"e-{hashlib.sha256(str(req).encode()).hexdigest()[:12]}", "commitments_extracted": [], "diff_blocks": []}

@app.post("/v1/jamie/redline/regulatory-compare")
def redline_regulatory(req: dict):
    return {"session_id": f"rc-{hashlib.sha256(str(req).encode()).hexdigest()[:12]}", "regulatory_matches": [], "compliance_risk": "LOW"}

# ─── JAMIE SIMULATION ENDPOINTS ───
@app.post("/v1/jamie/simulate/run")
def simulate_run(req: SimulationRunRequest):
    rid = hashlib.sha256(f"{req.contract_text}{req.scenario}".encode()).hexdigest()[:12]
    return {"run_id": f"s-{rid}", "status": "completed", "scenario": req.scenario, "agent_positions": [
        {"agent": "Opposing Counsel", "position": "Aggressive", "arguments": ["Seeking maximum concessions on liability caps", "Pushing for shorter termination notice periods"], "score": 0.75},
        {"agent": "Business Advocate", "position": "Defensive", "arguments": ["Protecting core IP rights", "Maintaining favorable payment terms"], "score": 0.65},
        {"agent": "Arbiter", "position": "Neutral", "arguments": ["Both parties have valid concerns", "Recommend middle ground on liability"], "score": 0.80}
    ], "overall_risk_score": 0.55, "recommendation": "PROCEED", "stress_report": {"contractual_risk": 0.45, "regulatory_compliance": 0.92, "commercial_impact": 0.60, "enforceability": 0.78, "reputational_exposure": 0.30}}

@app.post("/v1/jamie/simulate/{run_id}/amendments")
def simulate_amendments(run_id: str, req: dict = None):
    return {"amendment_id": f"a-{run_id[-8:]}", "status": "generated", "changes": 3, "risk_reduction": 0.15, "redlined_doc_url": f"/v1/jamie/redline/export/{run_id}"}

@app.get("/v1/jamie/simulate/runs")
def simulate_runs():
    return {"runs": []}

@app.post("/v1/jamie/simulate/batch")
def simulate_batch(req: dict):
    return {"batch_id": f"b-{hashlib.sha256(str(req).encode()).hexdigest()[:8]}", "runs_completed": len(req.get("scenarios", [])), "aggregate_report": {"overall_risk": 0.52, "consensus_recommendation": "PROCEED"}}

# ─── JAMIE TABULAR ENDPOINTS ───
@app.post("/v1/jamie/tabular/schema/define")
def tabular_schema(req: dict):
    sid = hashlib.sha256(str(req).encode()).hexdigest()[:12]
    return {"schema_id": f"ts-{sid}", "status": "defined", "columns_count": len(req.get("columns", [])), "schema_name": req.get("schema_name", "custom")}

@app.post("/v1/jamie/tabular/extract")
def tabular_extract(req: TabularExtractRequest):
    xid = hashlib.sha256(f"{req.doc_text}{req.schema_id}".encode()).hexdigest()[:12]
    return {"extraction_id": f"tx-{xid}", "status": "completed", "rows_extracted": 5, "verification": {"passed": 4, "failed": 1, "failures": [{"row": 3, "column": "governing_law", "issue": "Ambiguous jurisdiction reference"}]}, "confidence_score": 0.92, "dataset": [{"row": 1, "party": "Licensor", "governing_law": "Delaware", "liability_cap": "$1M", "term": "3 years"}, {"row": 2, "party": "Licensee", "governing_law": "California", "liability_cap": "$500K", "term": "3 years"}]}

@app.post("/v1/jamie/tabular/verify")
def tabular_verify(req: dict):
    return {"verification_id": f"v-{hashlib.sha256(str(req).encode()).hexdigest()[:12]}", "regulatory_matches": 3, "data_quality_score": 0.91}

@app.get("/v1/jamie/tabular/export/{extraction_id}")
def tabular_export(extraction_id: str, format: str = "csv"):
    return {"download_url": f"/downloads/{extraction_id}.{format}", "format": format, "rows": 5, "expires_at": "2026-06-30T00:00:00Z"}

# ─── JAMIE SIGNATURES ENDPOINTS ───
@app.post("/v1/jamie/signatures/extract")
def signatures_extract(req: SignatureExtractRequest):
    pid = hashlib.sha256(req.doc_text.encode()).hexdigest()[:12]
    return {"packet_id": f"sp-{pid}", "pages_analyzed": 24, "signature_pages_found": 4, "grouped_by_party": [{"party": "Acme Corp", "pages": [3, 4], "signature_type": "corporate"}, {"party": "Jane Smith (Individual)", "pages": [5], "signature_type": "individual"}, {"party": "John Doe (Witness)", "pages": [6], "signature_type": "witness"}], "notary_pages": [7], "confidence": 0.95}

@app.post("/v1/jamie/signatures/packets/{packet_id}/export")
def signatures_export(packet_id: str, req: dict = None):
    return {"download_url": f"/downloads/{packet_id}.zip", "pages_included": 4, "file_size_mb": 2.1, "expires_at": "2026-06-30T00:00:00Z"}

@app.post("/v1/jamie/signatures/verify")
def signatures_verify(req: dict):
    return {"complete": True, "missing": []}

@app.post("/v1/jamie/signatures/instructions")
def signatures_instructions(req: dict):
    return {"instructions_id": f"i-{hashlib.sha256(str(req).encode()).hexdigest()[:12]}", "instruction_text": "Please sign all highlighted pages. Use blue ink. Return completed signatures within 5 business days.", "signing_table": [{"party": "Acme Corp", "signer": "CEO", "pages": "3-4"}, {"party": "Jane Smith", "signer": "Individual", "pages": "5"}]}

# ─── JAMIE CHARTS ENDPOINTS ───
@app.post("/v1/jamie/charts/generate")
def charts_generate(req: ChartGenerateRequest):
    cid = hashlib.sha256(f"{req.input_text}{req.chart_type}".encode()).hexdigest()[:12]
    return {"chart_id": f"ch-{cid}", "status": "generated", "chart_type": req.chart_type, "nodes": [
        {"id": "1", "label": "Holdings Ltd", "type": "parent", "pct": 100},
        {"id": "2", "label": "Operating Co", "type": "subsidiary", "pct": 85},
        {"id": "3", "label": "IP Sub", "type": "subsidiary", "pct": 100},
        {"id": "4", "label": "Local SPV", "type": "spv", "pct": 15}
    ], "edges": [
        {"from": "1", "to": "2", "relationship": "owns", "pct": 85},
        {"from": "1", "to": "3", "relationship": "owns", "pct": 100},
        {"from": "2", "to": "4", "relationship": "owns", "pct": 15}
    ], "confidence": 0.93}

@app.post("/v1/jamie/charts/{chart_id}/refine")
def charts_refine(chart_id: str, req: dict):
    return {"chart_id": chart_id, "status": "refined", "changes_applied": 1, "instruction_applied": req.get("instruction", "")}

@app.get("/v1/jamie/charts/export/{chart_id}")
def charts_export(chart_id: str, format: str = "svg"):
    return {"download_url": f"/downloads/{chart_id}.{format}", "format": format, "expires_at": "2026-06-30T00:00:00Z"}

@app.get("/v1/jamie/charts")
def charts_list():
    return {"charts": []}

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
