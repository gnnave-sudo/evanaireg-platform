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


class EntityUpdate(BaseModel):
    name: Optional[str] = None
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    entity_type: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class JurisdictionCreate(BaseModel):
    jurisdiction_code: str
    jurisdiction_name: Optional[str] = None
    entity_type: Optional[str] = None
    registered_date: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class RuleCreate(BaseModel):
    rule_type: str
    rule_name: Optional[str] = None
    jurisdiction_code: Optional[str] = None
    severity: Optional[str] = "MEDIUM"
    check_config: Optional[Dict[str, Any]] = None


class ThresholdCreate(BaseModel):
    threshold_type: str
    threshold_value: float
    unit: Optional[str] = None
    applies_to: Optional[str] = "all"
    jurisdiction_code: Optional[str] = None


class NLQueryRequest(BaseModel):
    query: str
    entity_slug: str


class IngestRequest(BaseModel):
    text: str
    entity_slug: str
    jurisdiction_code: str = ""
    doc_id: str = ""
    title: str = ""
