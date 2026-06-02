const API_BASE = ''

function getApiKey(): string {
  return localStorage.getItem('evan_api_key') || 'evan-x870-local-key'
}

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
  }
  if (body) opts.body = JSON.stringify(body)
  const resp = await fetch(`${API_BASE}${path}`, opts)
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`API ${resp.status}: ${text}`)
  }
  return resp.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => api<T>('GET', path),
  post: <T>(path: string, body: unknown) => api<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => api<T>('PUT', path, body),
  del: <T>(path: string) => api<T>('DELETE', path),
}

export interface NLQueryResponse {
  agent: string
  intent: string
  response: string
  confidence: number
  entity: string
  source?: string
}

export interface Entity {
  id: number
  slug: string
  name: string
  legal_name: string
  industry: string
  status: string
}

export interface ComplianceRule {
  id: number
  rule_type: string
  rule_name: string
  jurisdiction_code: string
  severity: string
  status: string
}

export interface Transaction {
  id: number
  tx_type: string
  amount: number
  currency: string
  timestamp: string
  counterparty: string
  description: string
}

export interface Jurisdiction {
  id: number
  jurisdiction_code: string
  jurisdiction_name: string
  entity_type: string
  status: string
  registered_date: string
}

export interface Threshold {
  id: number
  threshold_type: string
  threshold_value: number
  unit: string
  applies_to: string
  jurisdiction_code: string
  status: string
}

export interface EntityDetail extends Entity {
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function nlQuery(entitySlug: string, query: string): Promise<NLQueryResponse> {
  return apiClient.post<NLQueryResponse>('/v1/nl/query', { entity_slug: entitySlug, query })
}

export async function getEntities(): Promise<{ entities: EntityDetail[] }> {
  return apiClient.get('/v1/entities')
}

export async function getEntity(slug: string): Promise<EntityDetail> {
  return apiClient.get(`/v1/entities/${slug}`)
}

export async function getEntityJurisdictions(slug: string): Promise<{ jurisdictions: Jurisdiction[] }> {
  return apiClient.get(`/v1/entities/${slug}/jurisdictions`)
}

export async function getEntityRules(slug: string): Promise<{ rules: ComplianceRule[] }> {
  return apiClient.get(`/v1/entities/${slug}/rules`)
}

export async function getEntityThresholds(slug: string): Promise<{ thresholds: Threshold[] }> {
  return apiClient.get(`/v1/entities/${slug}/thresholds`)
}
