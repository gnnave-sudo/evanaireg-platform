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


class IngestRequest(BaseModel):
    text: str
    entity_slug: str
    jurisdiction_code: str = ""
    doc_id: str = ""
    title: str = ""
