import sqlite3, json
from typing import Optional, Dict, Any


class EntityManager:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def create_entity(self, slug: str, name: str, legal_name: str = None, industry: str = None,
                      entity_type: str = "company", status: str = "active", metadata: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute(
            "INSERT OR REPLACE INTO entities (slug, name, legal_name, industry, entity_type, status, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (slug, name, legal_name, industry, entity_type, status, json.dumps(metadata or {}))
        )
        conn.commit()
        conn.close()
        return {"slug": slug, "name": name}

    def update_entity(self, slug: str, **fields):
        conn = self._conn()
        c = conn.cursor()
        allowed = {"name", "legal_name", "industry", "entity_type", "status", "metadata"}
        updates = {k: v for k, v in fields.items() if k in allowed and v is not None}
        if not updates:
            conn.close()
            return None
        if "metadata" in updates:
            updates["metadata"] = json.dumps(updates["metadata"])
        sets = ", ".join(f"{k}=?" for k in updates)
        c.execute(f"UPDATE entities SET {sets}, updated_at=CURRENT_TIMESTAMP WHERE slug=?", (*updates.values(), slug))
        conn.commit()
        conn.close()
        return self.get_entity(slug)

    def delete_entity(self, slug: str) -> bool:
        conn = self._conn()
        c = conn.cursor()
        c.execute("DELETE FROM entities WHERE slug=?", (slug,))
        deleted = c.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def list_entities(self):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id, slug, name, legal_name, industry, status FROM entities")
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return rows

    def get_entity(self, slug: str):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT * FROM entities WHERE slug=?", (slug,))
        row = c.fetchone()
        conn.close()
        return dict(row) if row else None

    # ── Jurisdictions ──
    def add_jurisdiction(self, entity_slug: str, jurisdiction_code: str, jurisdiction_name: str = None,
                         entity_type: str = None, registered_date: str = None, metadata: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute(
            "INSERT OR REPLACE INTO jurisdictions (entity_id, jurisdiction_code, jurisdiction_name, entity_type, registered_date, metadata) VALUES (?, ?, ?, ?, ?, ?)",
            (entity_id, jurisdiction_code, jurisdiction_name, entity_type, registered_date, json.dumps(metadata or {}))
        )
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "jurisdiction_code": jurisdiction_code}

    def list_jurisdictions(self, entity_slug: str):
        conn = self._conn()
        c = conn.cursor()
        c.execute(
            "SELECT j.* FROM jurisdictions j JOIN entities e ON j.entity_id=e.id WHERE e.slug=?",
            (entity_slug,),
        )
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return rows

    # ── Compliance Rules ──
    def add_rule(self, entity_slug: str, rule_type: str, rule_name: str = None,
                 jurisdiction_code: str = None, severity: str = "MEDIUM", check_config: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute(
            "INSERT INTO compliance_rules (entity_id, rule_type, rule_name, jurisdiction_code, severity, check_config) VALUES (?, ?, ?, ?, ?, ?)",
            (entity_id, rule_type, rule_name, jurisdiction_code, severity, json.dumps(check_config or {}))
        )
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "rule_type": rule_type}

    def list_rules(self, entity_slug: str):
        conn = self._conn()
        c = conn.cursor()
        c.execute(
            "SELECT r.* FROM compliance_rules r JOIN entities e ON r.entity_id=e.id WHERE e.slug=?",
            (entity_slug,),
        )
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return rows

    # ── Thresholds ──
    def add_threshold(self, entity_slug: str, threshold_type: str, threshold_value: float,
                      unit: str = None, applies_to: str = "all", jurisdiction_code: str = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute(
            "INSERT INTO compliance_thresholds (entity_id, threshold_type, threshold_value, unit, applies_to, jurisdiction_code) VALUES (?, ?, ?, ?, ?, ?)",
            (entity_id, threshold_type, threshold_value, unit, applies_to, jurisdiction_code)
        )
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "threshold_type": threshold_type}

    def list_thresholds(self, entity_slug: str):
        conn = self._conn()
        c = conn.cursor()
        c.execute(
            "SELECT t.* FROM compliance_thresholds t JOIN entities e ON t.entity_id=e.id WHERE e.slug=?",
            (entity_slug,),
        )
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return rows
