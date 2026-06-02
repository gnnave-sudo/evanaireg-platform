"""EvanAIRegPlatform API tests."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from api.main import app, API_KEY

client = TestClient(app)
AUTH = {"Authorization": f"Bearer {API_KEY}"}


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "healthy"
    assert "version" in body


def test_agents_status():
    resp = client.get("/v1/agents/status", headers=AUTH)
    assert resp.status_code == 200
    assert len(resp.json()["agents"]) == 4


def test_entities_crud():
    # Create
    resp = client.post("/v1/entities", headers=AUTH, json={
        "slug": "test-corp",
        "name": "Test Corporation",
        "legal_name": "Test Corp Inc.",
        "industry": "technology",
    })
    assert resp.status_code == 200
    assert resp.json()["slug"] == "test-corp"

    # List
    resp = client.get("/v1/entities", headers=AUTH)
    assert resp.status_code == 200
    assert any(e["slug"] == "test-corp" for e in resp.json()["entities"])


def test_nl_query():
    resp = client.post("/v1/nl/query", headers=AUTH, json={
        "query": "What is the revenue?",
        "entity_slug": "vortex-pay",
    })
    assert resp.status_code == 200
    body = resp.json()
    assert "response" in body
    assert "agent" in body


def test_vos_compliance():
    resp = client.post("/v1/vos/compliance/check", headers=AUTH, json={
        "query": "check compliance",
        "entity_slug": "vortex-pay",
    })
    assert resp.status_code == 200
    assert "compliance_score" in resp.json()


def test_tx_ingest_and_recent():
    resp = client.post("/v1/tx/ingest", headers=AUTH, json={
        "entity_slug": "vortex-pay",
        "tx_type": "deposit",
        "amount": 50000,
        "currency": "USD",
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "ingested"

    resp = client.get("/v1/tx/recent?entity_slug=vortex-pay", headers=AUTH)
    assert resp.status_code == 200
    assert len(resp.json()["transactions"]) >= 1


def test_ingest_text():
    resp = client.post("/v1/ingest/text", headers=AUTH, json={
        "text": "This is a test regulatory document.",
        "entity_slug": "vortex-pay",
        "title": "Test Doc",
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "ingested"


def test_unauthorized():
    resp = client.get("/v1/agents/status")
    assert resp.status_code == 401
