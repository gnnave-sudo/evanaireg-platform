import sqlite3, json
from typing import Optional, Dict, Any

class EntityManager:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def create_entity(self, slug: str, name: str, legal_name: str = None, industry: str = None, metadata: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO entities (slug, name, legal_name, industry, metadata) VALUES (?, ?, ?, ?, ?)",
                  (slug, name, legal_name, industry, json.dumps(metadata or {})))
        conn.commit()
        conn.close()
        return {"slug": slug, "name": name}

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

    def add_jurisdiction(self, entity_slug: str, code: str, name: str, meta: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute("INSERT OR REPLACE INTO jurisdictions (entity_id, jurisdiction_code, jurisdiction_name, metadata) VALUES (?, ?, ?, ?)",
                  (entity_id, code, name, json.dumps(meta or {})))
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "jurisdiction_code": code}

    def add_rule(self, entity_slug: str, rule_type: str, rule_name: str, jurisdiction_code: str = None, severity: str = "MEDIUM", check_config: dict = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute("INSERT INTO compliance_rules (entity_id, rule_type, rule_name, jurisdiction_code, severity, check_config) VALUES (?, ?, ?, ?, ?, ?)",
                  (entity_id, rule_type, rule_name, jurisdiction_code, severity, json.dumps(check_config or {})))
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "rule_type": rule_type}

    def add_threshold(self, entity_slug: str, threshold_type: str, value: float, unit: str = None, applies_to: str = "all", jurisdiction_code: str = None):
        conn = self._conn()
        c = conn.cursor()
        c.execute("SELECT id FROM entities WHERE slug=?", (entity_slug,))
        row = c.fetchone()
        if not row:
            conn.close()
            return None
        entity_id = row["id"]
        c.execute("INSERT INTO compliance_thresholds (entity_id, threshold_type, threshold_value, unit, applies_to, jurisdiction_code) VALUES (?, ?, ?, ?, ?, ?)",
                  (entity_id, threshold_type, value, unit, applies_to, jurisdiction_code))
        conn.commit()
        conn.close()
        return {"entity_id": entity_id, "threshold_type": threshold_type}
