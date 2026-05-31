from pydantic import BaseModel
from typing import Optional, Dict, Any

class EntityCreate(BaseModel):
    slug: str
    name: str
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    entity_type: Optional[str] = "company"
    status: Optional[str] = "active"
    metadata: Optional[Dict[str, Any]] = None

class NLQueryRequest(BaseModel):
    query: str
    entity_slug: str

class RedlineCompareRequest(BaseModel):
    doc_a_text: str
    doc_b_text: str
    granularity: str = "word"
    entity_slug: str = ""

class SimulationRunRequest(BaseModel):
    contract_text: str
    scenario: str = "negotiation"
    opposing_profile: Optional[Dict[str, Any]] = None
    jurisdiction_code: Optional[str] = None
    entity_slug: str = ""

class TabularExtractRequest(BaseModel):
    doc_text: str
    schema_id: Optional[str] = None
    columns: Optional[list] = None
    entity_slug: str = ""

class SignatureExtractRequest(BaseModel):
    doc_text: str
    entity_slug: str = ""

class ChartGenerateRequest(BaseModel):
    input_text: str
    chart_type: str = "ownership"
    entity_slug: str = ""

class IngestRequest(BaseModel):
    text: str
    entity_slug: str
    jurisdiction_code: str = ""
    doc_id: str = ""
    title: str = ""
