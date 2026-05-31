export interface SystemLayer {
  id: string
  name: string
  status: 'active' | 'warning' | 'idle'
  throughput: string
  lastRun: string
}

export interface StressResult {
  id: string
  scenario: number
  businessAdvocate: string
  complianceReviewer: string
  regulatorProxy: string
  neutralAdjudicator: string
  overallRisk: number
  dimensions: Record<string, number>
  recommendation: 'PROCEED' | 'HOLD' | 'NO-GO'
  timestamp: string
}

export interface CredibilityEntry {
  id: string
  counselName: string
  matterId: string
  dimensions: Record<string, number>
  weightedScore: number
  tier: 'HIGHLY_RELIABLE' | 'STRONG' | 'ACCEPTABLE' | 'WEAK' | 'HIGH_RISK'
  scoredAt: string
}

export interface PatternExtract {
  id: string
  jurisdiction: string
  productType: string
  riskDrivers: string[]
  recurrentObligations: string[]
  controlWeaknesses: string[]
  timestamp: string
}

export interface EscalationItem {
  id: string
  priority: 'P0' | 'P1' | 'P2'
  title: string
  description: string
  jurisdiction: string
  dueDate: string
  status: 'open' | 'in_progress' | 'resolved'
}

export interface DriftEvent {
  id: string
  productId: string
  previousScore: number
  currentScore: number
  driftMagnitude: number
  postureChange: string
  timestamp: string
}

export interface ControlInvestment {
  controlName: string
  priority: number
  estimatedCost: string
  riskReduction: number
  jurisdictions: string[]
}

export interface FactPacket {
  id: string
  jurisdiction: string
  regulator: string
  activityType: string
  productClass: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}
