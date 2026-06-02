const API_BASE = ''
const API_KEY = 'evan-x870-local-key'

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
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
