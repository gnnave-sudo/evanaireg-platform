export interface VosAgent {
  id: string
  name: string
  shortName: string
  status: 'Active' | 'Idle' | 'Warning'
  statLabel: string
  statValue: string
  description: string
  tools: string[]
  icon: 'globe' | 'credit-card' | 'file-text' | 'handshake'
}

export interface StressScenario {
  id: string
  name: string
  overallRisk: number
  recommendation: 'PROCEED' | 'HOLD' | 'NO-GO'
  businessAdvocate: string
  complianceReviewer: string
  regulatorProxy: string
  neutralAdjudicator: string
  dimensions: Record<string, number>
}

export interface PomeloTransaction {
  id: string
  amount: string
  rawAmount: number
  type: string
  status: 'Settled' | 'Pending' | 'Failed'
  risk: 'CLEAR' | 'FLAG'
  thresholdRef?: string
}

export interface ComplianceObligation {
  id: string
  name: string
  frequency: string
  deadline: string
  owner: string
  status: 'Active' | 'Due Soon' | 'CRITICAL' | 'Scheduled'
  detail?: string
}

export interface RiskFlag {
  id: string
  risk: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  status: string
  detail?: string
}

export interface NLQueryExample {
  query: string
  procedure: string
}

export interface ThresholdStatus {
  label: string
  current: number
  limit: number
  percentage: number
  unit: string
}
