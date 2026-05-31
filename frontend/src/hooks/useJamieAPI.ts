/**
 * useJamieAPI.ts
 * React Query-style hooks for all Jamie API endpoints.
 * Uses useState/useEffect patterns (no external query library required).
 */

import { useState, useEffect, useCallback } from 'react'

/* ──────── Types ──────── */

export interface RedlineDiff {
  id: string
  type: 'insert' | 'delete' | 'modify' | 'unchanged'
  oldText?: string
  newText?: string
  lineStart: number
  lineEnd: number
  label?: string
}

export interface RedlineSession {
  id: string
  docA: string
  docB: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  diffs: RedlineDiff[]
  stats: { inserts: number; deletes: number; modifies: number }
  createdAt: string
}

export interface SimulationAgent {
  role: string
  position: string
  arguments: string[]
  score: number
  color: string
}

export interface SimulationResult {
  id: string
  scenario: string
  status: 'running' | 'complete'
  agents: SimulationAgent[]
  overallRisk: number
  recommendation: 'PROCEED' | 'HOLD' | 'NO-GO'
  amendmentText?: string
  riskFactors: { label: string; score: number }[]
}

export interface TabularColumn {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean'
  constraint?: 'required' | 'unique' | 'none'
}

export interface TabularRow {
  id: string
  [key: string]: string | number | boolean | undefined
}

export interface TabularResult {
  columns: TabularColumn[]
  rows: TabularRow[]
  verification: {
    total: number
    passed: number
    failed: number
    failures: { row: number; column: string; reason: string }[]
  }
}

export interface SignatureParty {
  id: string
  name: string
  pages: number[]
  signatureBlocks: { type: string; page: number; bbox: [number, number, number, number] }[]
  status: 'complete' | 'incomplete' | 'missing'
}

export interface SignatureResult {
  pagesAnalyzed: number
  sigPagesFound: number
  parties: SignatureParty[]
  notaryBlocks: { page: number; type: string }[]
  witnessBlocks: { page: number; type: string }[]
  completeness: number
}

export interface ChartNode {
  id: string
  label: string
  type: 'entity' | 'spv' | 'fund' | 'person'
  x: number
  y: number
  ownership?: number
}

export interface ChartEdge {
  from: string
  to: string
  label: string
  ownership: number
}

export interface ChartResult {
  nodes: ChartNode[]
  edges: ChartEdge[]
  type: 'ownership' | 'lbo' | 'fund' | 'org'
}

export interface QuickClause {
  id: string
  oldText: string
  newText: string
  classification: 'substantive' | 'cosmetic' | 'critical'
  explanation: string
}

/* ──────── Mock data generators ──────── */

function generateMockDiffs(): RedlineDiff[] {
  return [
    { id: 'd1', type: 'delete', oldText: 'The Company shall indemnify the Vendor for any losses arising from breach of representations.', lineStart: 42, lineEnd: 42, label: 'DELETED' },
    { id: 'd2', type: 'insert', newText: 'The Company shall indemnify the Vendor for any direct losses arising from wilful breach of representations, capped at USD 5,000,000.', lineStart: 42, lineEnd: 43, label: 'INSERTED' },
    { id: 'd3', type: 'modify', oldText: 'Governing Law: This Agreement shall be governed by the laws of the State of California.', newText: 'Governing Law: This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of laws principles.', lineStart: 89, lineEnd: 89, label: 'MODIFIED' },
    { id: 'd4', type: 'modify', oldText: 'Termination Notice: Either party may terminate this Agreement with 30 days written notice.', newText: 'Termination Notice: Either party may terminate this Agreement with 60 days written notice. Immediate termination for material breach remains unaffected.', lineStart: 105, lineEnd: 106, label: 'MODIFIED' },
    { id: 'd5', type: 'insert', newText: 'Data Protection: Both parties agree to comply with applicable data protection regulations including GDPR and CCPA. A separate Data Processing Addendum is attached as Schedule D.', lineStart: 134, lineEnd: 136, label: 'INSERTED' },
    { id: 'd6', type: 'delete', oldText: 'The Vendor retains all intellectual property rights in pre-existing materials.', lineStart: 156, lineEnd: 156, label: 'DELETED' },
    { id: 'd7', type: 'insert', newText: 'The Vendor retains all intellectual property rights in pre-existing materials. The Company receives a perpetual, non-exclusive, royalty-free license to use such materials for internal business purposes.', lineStart: 156, lineEnd: 157, label: 'INSERTED' },
    { id: 'd8', type: 'modify', oldText: 'Liability Cap: USD 10,000,000', newText: 'Liability Cap: USD 15,000,000 for aggregate liability; USD 5,000,000 for individual claims.', lineStart: 178, lineEnd: 178, label: 'MODIFIED' },
    { id: 'd9', type: 'unchanged', oldText: 'Entire Agreement: This Agreement constitutes the entire agreement between the parties.', lineStart: 201, lineEnd: 201 },
  ]
}

function generateMockSimulation(): SimulationResult {
  return {
    id: `sim-${Date.now()}`,
    scenario: 'negotiation',
    status: 'complete',
    agents: [
      { role: 'Opposing Counsel', position: 'Aggressive — seeking uncapped liability', arguments: ['Vendor has stronger bargaining position', 'Market precedent supports broader indemnity', 'Client instructions are to push for max protection'], score: 72, color: 'text-red-400' },
      { role: 'Business Advocate', position: 'Balanced — protecting Company interests', arguments: ['Liability cap aligns with industry standards', '60-day notice provides adequate transition', 'IP license preserves Vendor relationships'], score: 65, color: 'text-warm-amber' },
      { role: 'Arbiter', position: 'Neutral — favoring compromise', arguments: ['Delaware governing law is standard for US M&A', 'USD 15M aggregate cap is within market range', 'Data protection addendum addresses regulatory risk'], score: 78, color: 'text-emerald-400' },
    ],
    overallRisk: 42,
    recommendation: 'PROCEED',
    amendmentText: 'RECOMMENDED AMENDMENT: Retain Delaware governing law and USD 15M aggregate cap. Consider increasing individual claim cap to USD 7.5M as a concession point. Maintain 60-day termination notice.',
    riskFactors: [
      { label: 'Liability Exposure', score: 35 },
      { label: 'Regulatory Risk', score: 55 },
      { label: 'IP Protection', score: 25 },
      { label: 'Termination Flexibility', score: 40 },
      { label: 'Counterparty Risk', score: 60 },
    ],
  }
}

function generateMockTabular(): TabularResult {
  const columns: TabularColumn[] = [
    { name: 'Clause Type', type: 'text', constraint: 'required' },
    { name: 'Governing Law', type: 'text' },
    { name: 'Liability Cap', type: 'number' },
    { name: 'Termination Notice (days)', type: 'number' },
    { name: 'IP Assignment', type: 'text' },
    { name: 'Data Protection', type: 'boolean' },
    { name: 'Indemnity Scope', type: 'text' },
  ]
  const rows: TabularRow[] = [
    { id: 'r1', 'Clause Type': 'Master Services Agreement', 'Governing Law': 'Delaware', 'Liability Cap': 15000000, 'Termination Notice (days)': 60, 'IP Assignment': 'License (non-exclusive)', 'Data Protection': true, 'Indemnity Scope': 'Direct losses only' },
    { id: 'r2', 'Clause Type': 'Data Processing Addendum', 'Governing Law': 'GDPR / CCPA', 'Liability Cap': 5000000, 'Termination Notice (days)': 30, 'IP Assignment': 'N/A', 'Data Protection': true, 'Indemnity Scope': 'Regulatory fines' },
    { id: 'r3', 'Clause Type': 'Intellectual Property License', 'Governing Law': 'Delaware', 'Liability Cap': 10000000, 'Termination Notice (days)': 90, 'IP Assignment': 'Perpetual license', 'Data Protection': false, 'Indemnity Scope': 'Infringement claims' },
    { id: 'r4', 'Clause Type': 'Non-Disclosure Agreement', 'Governing Law': 'California', 'Liability Cap': 2500000, 'Termination Notice (days)': 14, 'IP Assignment': 'Retained by discloser', 'Data Protection': true, 'Indemnity Scope': 'Breach of confidentiality' },
    { id: 'r5', 'Clause Type': 'Statement of Work #1', 'Governing Law': 'Delaware', 'Liability Cap': 8000000, 'Termination Notice (days)': 45, 'IP Assignment': 'Work for hire', 'Data Protection': true, 'Indemnity Scope': 'Direct & consequential' },
  ]
  return {
    columns,
    rows,
    verification: {
      total: 35,
      passed: 31,
      failed: 4,
      failures: [
        { row: 2, column: 'Governing Law', reason: 'Expected "Delaware" but found "GDPR / CCPA" — mixed jurisdiction clause' },
        { row: 4, column: 'Governing Law', reason: 'Expected "Delaware" but found "California" — inconsistent with MSA' },
        { row: 5, column: 'Liability Cap', reason: 'Value 8,000,000 exceeds MSA cap of 15,000,000 but SOW has independent cap — verify intent' },
        { row: 5, column: 'IP Assignment', reason: '"Work for hire" conflicts with MSA "License (non-exclusive)" — clarify hierarchy' },
      ],
    },
  }
}

function generateMockSignatures(): SignatureResult {
  return {
    pagesAnalyzed: 47,
    sigPagesFound: 5,
    parties: [
      {
        id: 'p1',
        name: 'Vortex Technologies Inc.',
        pages: [42, 43],
        signatureBlocks: [
          { type: 'Signature (CEO)', page: 42, bbox: [0.1, 0.75, 0.45, 0.9] },
          { type: 'Initials (Footer)', page: 43, bbox: [0.7, 0.88, 0.85, 0.95] },
        ],
        status: 'complete',
      },
      {
        id: 'p2',
        name: 'Crimson Ventures LLC',
        pages: [42, 43, 44],
        signatureBlocks: [
          { type: 'Signature (Managing Director)', page: 42, bbox: [0.5, 0.75, 0.85, 0.9] },
          { type: 'Corporate Seal', page: 43, bbox: [0.3, 0.3, 0.5, 0.5] },
          { type: 'Initials (Footer)', page: 44, bbox: [0.7, 0.88, 0.85, 0.95] },
        ],
        status: 'complete',
      },
      {
        id: 'p3',
        name: 'Meridian Advisors Ltd (Escrow)',
        pages: [45],
        signatureBlocks: [
          { type: 'Signature (Escrow Agent)', page: 45, bbox: [0.2, 0.7, 0.5, 0.85] },
        ],
        status: 'incomplete',
      },
    ],
    notaryBlocks: [
      { page: 42, type: 'Notary Acknowledgment' },
    ],
    witnessBlocks: [
      { page: 42, type: 'Witness Signature (x2)' },
    ],
    completeness: 78,
  }
}

function generateMockChart(): ChartResult {
  return {
    nodes: [
      { id: 'n1', label: 'Holdings Ltd', type: 'entity', x: 400, y: 60 },
      { id: 'n2', label: 'Cayman SPV', type: 'spv', x: 250, y: 160 },
      { id: 'n3', label: 'Operating Co', type: 'entity', x: 550, y: 160 },
      { id: 'n4', label: 'Fund I LP', type: 'fund', x: 150, y: 280 },
      { id: 'n5', label: 'Fund II LP', type: 'fund', x: 350, y: 280 },
      { id: 'n6', label: 'Management', type: 'person', x: 550, y: 280 },
      { id: 'n7', label: 'Subsidiary A', type: 'entity', x: 450, y: 380 },
      { id: 'n8', label: 'Subsidiary B', type: 'entity', x: 650, y: 380 },
    ],
    edges: [
      { from: 'n1', to: 'n2', label: 'owns', ownership: 100 },
      { from: 'n1', to: 'n3', label: 'owns', ownership: 85 },
      { from: 'n2', to: 'n4', label: 'feeds', ownership: 45 },
      { from: 'n2', to: 'n5', label: 'feeds', ownership: 30 },
      { from: 'n3', to: 'n7', label: 'subsidiary', ownership: 100 },
      { from: 'n3', to: 'n8', label: 'subsidiary', ownership: 100 },
      { from: 'n6', to: 'n3', label: 'controls', ownership: 15 },
    ],
    type: 'ownership',
  }
}

function generateMockClauses(): QuickClause[] {
  return [
    { id: 'c1', oldText: 'The Vendor shall deliver the software within 90 days of contract execution.', newText: 'The Vendor shall deliver the software within 120 days of contract execution, with milestone deliverables at day 30, 60, and 90.', classification: 'substantive', explanation: 'Timeline extension with added milestone structure changes delivery obligations significantly.' },
    { id: 'c2', oldText: 'Payment terms: Net 30', newText: 'Payment terms: Net 30 days from invoice date', classification: 'cosmetic', explanation: 'Clarification only — no material change to payment obligation.' },
    { id: 'c3', oldText: 'Limitation of Liability: USD 1,000,000', newText: 'Limitation of Liability: USD 5,000,000', classification: 'critical', explanation: '5x increase in liability cap fundamentally alters risk allocation.' },
    { id: 'c4', oldText: 'This Agreement may be terminated by either party with 30 days notice.', newText: 'This Agreement may be terminated by either party with 60 days notice.', classification: 'substantive', explanation: 'Doubling notice period affects operational planning and transition costs.' },
  ]
}

/* ──────── Delay helper ──────── */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ──────── Redline hooks ──────── */

export function useRedlineCompare() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<RedlineSession | null>(null)

  const compare = useCallback(async (docAId: string, docBId: string) => {
    setLoading(true)
    setError(null)
    try {
      await delay(1200)
      const diffs = generateMockDiffs()
      const session: RedlineSession = {
        id: `session-${Date.now()}`,
        docA: docAId,
        docB: docBId,
        status: 'complete',
        diffs,
        stats: {
          inserts: diffs.filter((d) => d.type === 'insert').length,
          deletes: diffs.filter((d) => d.type === 'delete').length,
          modifies: diffs.filter((d) => d.type === 'modify').length,
        },
        createdAt: new Date().toISOString(),
      }
      setData(session)
      return session
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Comparison failed'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { compare, loading, error, data }
}

export function useRedlineSession(sessionId?: string) {
  const [session, setSession] = useState<RedlineSession | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    delay(500).then(() => {
      const diffs = generateMockDiffs()
      setSession({
        id: sessionId,
        docA: 'doc-a',
        docB: 'doc-b',
        status: 'complete',
        diffs,
        stats: { inserts: 3, deletes: 2, modifies: 3 },
        createdAt: new Date().toISOString(),
      })
      setLoading(false)
    })
  }, [sessionId])

  return { session, loading }
}

export function useRedlineChat(sessionId: string) {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  const send = useCallback(
    async (message: string) => {
      const userMsg = { id: `msg-${Date.now()}`, role: 'user' as const, content: message }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)
      await delay(800)

      const responses: Record<string, string> = {
        'explain': 'The key changes involve: (1) Narrowing indemnity scope to "direct losses" and adding a USD 5M cap, (2) Switching governing law from California to Delaware, (3) Extending termination notice from 30 to 60 days, (4) Adding comprehensive data protection provisions, and (5) Clarifying IP rights with a perpetual license.',
        'summarize': '5 substantive modifications identified: 3 insertions, 2 deletions, and 4 modifications. The net effect reduces Company liability exposure while adding regulatory compliance obligations.',
        'risk': 'Moderate risk. The liability cap reduction (USD 10M → USD 5M per claim) is favorable. However, the 60-day termination notice may impact operational flexibility. Data protection addendum introduces new compliance costs estimated at $50K-100K annually.',
      }

      const key = Object.keys(responses).find((k) => message.toLowerCase().includes(k))
      const response = key ? responses[key] : `Analysis for "${message}": The redline comparison shows favorable adjustments to liability provisions with balanced regulatory compliance additions. Overall risk profile: LOW-MODERATE.`

      const assistantMsg = { id: `msg-${Date.now() + 1}`, role: 'assistant' as const, content: response }
      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    },
    [sessionId]
  )

  return { messages, loading, send }
}

/* ──────── Simulation hooks ──────── */

export function useSimulationRun() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)

  const run = useCallback(async (_config: { scenario: string; stance: string; jurisdiction: string }) => {
    setLoading(true)
    await delay(2000)
    const mock = generateMockSimulation()
    setResult(mock)
    setLoading(false)
    return mock
  }, [])

  return { run, loading, result }
}

export function useSimulationRuns() {
  const [runs, setRuns] = useState<SimulationResult[]>([])

  useEffect(() => {
    setRuns([
      { ...generateMockSimulation(), id: 'sim-prev-1', scenario: 'negotiation' },
      { ...generateMockSimulation(), id: 'sim-prev-2', scenario: 'arbitration', recommendation: 'HOLD', overallRisk: 58 },
    ])
  }, [])

  return { runs }
}

export function useAmendments() {
  const [amendment, setAmendment] = useState<string>('')

  const generate = useCallback(async (_simulationId: string) => {
    await delay(600)
    const text = `RECOMMENDED AMENDMENTS:\n\n1. LIABILITY (Section 8.3)\n   - Keep aggregate cap at USD 15,000,000\n   - Raise individual claim cap to USD 7,500,000 as concession\n   - Add carve-out for willful misconduct\n\n2. TERMINATION (Section 12.1)\n   - Maintain 60-day notice period\n   - Add acceleration clause for material breach\n\n3. GOVERNING LAW (Section 14.2)\n   - Confirm Delaware — standard for M&A\n   - Add arbitration clause for disputes under $500K\n\n4. DATA PROTECTION (NEW Schedule D)\n   - Accept GDPR/CCPA addendum\n   - Cap regulatory fines at lower of actual or $2M`
    setAmendment(text)
    return text
  }, [])

  return { amendment, generate }
}

/* ──────── Tabular hooks ──────── */

export function useSchemaDefine() {
  const [columns, setColumns] = useState<TabularColumn[]>([])

  const defineFromNL = useCallback(async (_description: string) => {
    await delay(800)
    const cols: TabularColumn[] = [
      { name: 'Clause Type', type: 'text', constraint: 'required' },
      { name: 'Governing Law', type: 'text' },
      { name: 'Liability Cap (USD)', type: 'number', constraint: 'required' },
      { name: 'Termination Notice (days)', type: 'number' },
      { name: 'IP Assignment', type: 'text' },
      { name: 'Data Protection', type: 'boolean' },
    ]
    setColumns(cols)
    return cols
  }, [])

  return { columns, defineFromNL }
}

export function useTabularExtract() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TabularResult | null>(null)

  const extract = useCallback(async (_documentIds: string[], _columns: TabularColumn[], _model: string) => {
    setLoading(true)
    await delay(1500)
    const result = generateMockTabular()
    setData(result)
    setLoading(false)
    return result
  }, [])

  return { extract, loading, data }
}

export function useTabularVerify() {
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<{ passed: number; failed: number; failures: { row: number; column: string; reason: string }[] } | null>(null)

  const verify = useCallback(async (_tabularId: string) => {
    setVerifying(true)
    await delay(1000)
    const res = {
      passed: 31,
      failed: 4,
      failures: [
        { row: 2, column: 'Governing Law', reason: 'Inconsistent jurisdiction — expected Delaware, found mixed' },
        { row: 4, column: 'Governing Law', reason: 'Expected Delaware, found California' },
        { row: 5, column: 'Liability Cap', reason: 'SOW cap may exceed MSA cap — verify' },
        { row: 5, column: 'IP Assignment', reason: 'Work-for-hire conflicts with MSA license terms' },
      ],
    }
    setResult(res)
    setVerifying(false)
    return res
  }, [])

  return { verify, verifying, result }
}

/* ──────── Signature hooks ──────── */

export function useSignatureExtract() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SignatureResult | null>(null)

  const extract = useCallback(async (_documentId: string) => {
    setLoading(true)
    await delay(2000)
    const mock = generateMockSignatures()
    setResult(mock)
    setLoading(false)
    return mock
  }, [])

  return { extract, loading, result }
}

export function useSignaturePacket() {
  const [packet, setPacket] = useState<{ completeness: number; instructions: string[] } | null>(null)

  const generate = useCallback(async (_signatureId: string) => {
    await delay(800)
    const res = {
      completeness: 78,
      instructions: [
        'Add CEO signature block for Vortex Technologies Inc. on page 42',
        'Complete Escrow Agent signature on page 45 — currently blank',
        'Attach notary acknowledgment with seal for page 42',
        'Add witness signatures (x2) on page 42',
      ],
    }
    setPacket(res)
    return res
  }, [])

  return { packet, generate }
}

export function useSignatureExport() {
  const exportPacket = useCallback(async (signatureId: string, format: 'zip' | 'pdf') => {
    await delay(600)
    return { url: `/mock/signature-${signatureId}.${format}`, format }
  }, [])

  return { exportPacket }
}

/* ──────── Chart hooks ──────── */

export function useChartGenerate() {
  const [loading, setLoading] = useState(false)
  const [chart, setChart] = useState<ChartResult | null>(null)

  const generate = useCallback(async (_description: string, chartType: ChartResult['type']) => {
    setLoading(true)
    await delay(1800)
    const mock = generateMockChart()
    mock.type = chartType
    setChart(mock)
    setLoading(false)
    return mock
  }, [])

  return { generate, loading, chart }
}

export function useChartRefine() {
  const [refining, setRefining] = useState(false)

  const refine = useCallback(async (_chartId: string, instruction: string) => {
    setRefining(true)
    await delay(1200)
    setRefining(false)
    return { success: true, message: `Applied: ${instruction}` }
  }, [])

  return { refine, refining }
}

export function useChartExport() {
  const exportChart = useCallback(async (chartId: string, format: 'svg' | 'png') => {
    await delay(400)
    return { url: `/mock/chart-${chartId}.${format}`, format }
  }, [])

  return { exportChart }
}

/* ──────── Quick Compare (RedlineNow) hooks ──────── */

export function useRedlineNowClauses() {
  const [analyzing, setAnalyzing] = useState(false)
  const [clauses, setClauses] = useState<QuickClause[]>([])

  const analyze = useCallback(async (_oldText: string, _newText: string) => {
    setAnalyzing(true)
    await delay(900)
    const results = generateMockClauses()
    setClauses(results)
    setAnalyzing(false)
    return results
  }, [])

  return { analyze, analyzing, clauses }
}

export function useRedlineNowEmails() {
  const [generating, setGenerating] = useState(false)

  const generateEmail = useCallback(async (_clauses: QuickClause[], _recipient: string) => {
    setGenerating(true)
    await delay(700)
    setGenerating(false)
    return {
      subject: 'Contract Change Summary — Action Required',
      body: `Please review the following ${_clauses.length} changes:\n\n${_clauses.map((c: QuickClause) => `- [${c.classification.toUpperCase()}] ${c.oldText.slice(0, 60)}...`).join('\n')}\n\nPlease confirm your acceptance.`,
    }
  }, [])

  return { generateEmail, generating }
}
