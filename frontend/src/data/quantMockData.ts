import type {
  SystemLayer,
  StressResult,
  CredibilityEntry,
  PatternExtract,
  EscalationItem,
  DriftEvent,
  ControlInvestment,
  FactPacket,
} from '@/types/quant'

export const systemLayers: SystemLayer[] = [
  {
    id: 'L0',
    name: 'L0 Raw Input',
    status: 'active',
    throughput: '47 req/hr',
    lastRun: '2026-01-15T09:42:00Z',
  },
  {
    id: 'L1',
    name: 'L1 Intake',
    status: 'active',
    throughput: '44 proc/hr',
    lastRun: '2026-01-15T09:41:00Z',
  },
  {
    id: 'L2',
    name: 'L2 Stress Lab',
    status: 'active',
    throughput: '12 sim/hr',
    lastRun: '2026-01-15T09:40:00Z',
  },
  {
    id: 'L3',
    name: 'L3 Patterns',
    status: 'active',
    throughput: '8 extr/hr',
    lastRun: '2026-01-15T09:38:00Z',
  },
  {
    id: 'L4',
    name: 'L4 Alignment',
    status: 'active',
    throughput: '6 adj/hr',
    lastRun: '2026-01-15T09:35:00Z',
  },
  {
    id: 'L5',
    name: 'L5 Outputs',
    status: 'active',
    throughput: '5 out/hr',
    lastRun: '2026-01-15T09:34:00Z',
  },
  {
    id: 'L6',
    name: 'L6 Learning',
    status: 'active',
    throughput: '3 learn/hr',
    lastRun: '2026-01-15T09:30:00Z',
  },
  {
    id: 'CS',
    name: 'CS Credibility',
    status: 'active',
    throughput: '9 score/hr',
    lastRun: '2026-01-15T09:28:00Z',
  },
]

export const stressResults: StressResult[] = [
  {
    id: 'SR-001',
    scenario: 1,
    businessAdvocate:
      'Pursue full DPT licence with retail safeguards — market opportunity is substantial and regulatory framework is navigable.',
    complianceReviewer:
      'Applicant demonstrates strong AML/CFT controls but retail access requires enhanced custody arrangements and cooling-off periods.',
    regulatorProxy:
      'MAS expects explicit disclosure of counterparty risks and segregation of retail/client assets. Travel rule compliance is non-negotiable.',
    neutralAdjudicator:
      'Risk-adjusted pathway available: conditional approval with phased retail rollout and quarterly attestations.',
    overallRisk: 58,
    dimensions: {
      'AML/CFT': 72,
      Custody: 65,
      Disclosure: 80,
      'Travel Rule': 45,
      'Consumer Protection': 55,
      'Market Abuse': 60,
      'Systemic Risk': 40,
      'Cyber Resilience': 70,
      'Operational Risk': 50,
      'Legal Certainty': 62,
    },
    recommendation: 'HOLD',
    timestamp: '2026-01-14T16:30:00Z',
  },
  {
    id: 'SR-002',
    scenario: 2,
    businessAdvocate:
      'DeFi protocol structure falls outside traditional DPT licensing — opportunity for regulatory sandbox entry with limited scope.',
    complianceReviewer:
      'Smart contract audit gaps identified. Cross-border jurisdictional overlap creates compliance ambiguity on settlement finality.',
    regulatorProxy:
      'Novel product class requires bespoke framework. Existing PS Act may not adequately capture protocol-level risks. Enforcement action possible.',
    neutralAdjudicator:
      'High uncertainty across multiple dimensions. Recommend no-go pending regulatory clarity and enhanced technical controls.',
    overallRisk: 71,
    dimensions: {
      'AML/CFT': 55,
      Custody: 35,
      Disclosure: 60,
      'Travel Rule': 30,
      'Consumer Protection': 40,
      'Market Abuse': 50,
      'Systemic Risk': 65,
      'Cyber Resilience': 45,
      'Operational Risk': 70,
      'Legal Certainty': 30,
    },
    recommendation: 'NO-GO',
    timestamp: '2026-01-14T18:15:00Z',
  },
]

export const credibilityEntries: CredibilityEntry[] = [
  {
    id: 'CE-001',
    counselName: 'Norton Rose Fulbright',
    matterId: 'SG-DPT-2026-0041',
    dimensions: {
      'Technical Depth': 65,
      'Regulatory Foresight': 58,
      'Consistency': 72,
      'Jurisdiction Coverage': 80,
      'Citation Quality': 55,
      'Risk Transparency': 44,
    },
    weightedScore: 60.85,
    tier: 'ACCEPTABLE',
    scoredAt: '2026-01-13T11:20:00Z',
  },
  {
    id: 'CE-002',
    counselName: 'Clifford Chance',
    matterId: 'SG-DPT-2026-0042',
    dimensions: {
      'Technical Depth': 82,
      'Regulatory Foresight': 75,
      'Consistency': 88,
      'Jurisdiction Coverage': 72,
      'Citation Quality': 80,
      'Risk Transparency': 73,
    },
    weightedScore: 78.4,
    tier: 'STRONG',
    scoredAt: '2026-01-13T10:45:00Z',
  },
  {
    id: 'CE-003',
    counselName: 'Freshfields Bruckhaus',
    matterId: 'SG-DPT-2026-0043',
    dimensions: {
      'Technical Depth': 50,
      'Regulatory Foresight': 42,
      'Consistency': 48,
      'Jurisdiction Coverage': 38,
      'Citation Quality': 55,
      'Risk Transparency': 40,
    },
    weightedScore: 45.2,
    tier: 'WEAK',
    scoredAt: '2026-01-12T16:00:00Z',
  },
  {
    id: 'CE-004',
    counselName: 'Allen & Gledhill',
    matterId: 'SG-DPT-2026-0044',
    dimensions: {
      'Technical Depth': 90,
      'Regulatory Foresight': 85,
      'Consistency': 92,
      'Jurisdiction Coverage': 65,
      'Citation Quality': 88,
      'Risk Transparency': 82,
    },
    weightedScore: 84.5,
    tier: 'HIGHLY_RELIABLE',
    scoredAt: '2026-01-13T09:15:00Z',
  },
  {
    id: 'CE-005',
    counselName: 'Rajah & Tann',
    matterId: 'SG-DPT-2026-0045',
    dimensions: {
      'Technical Depth': 55,
      'Regulatory Foresight': 60,
      'Consistency': 52,
      'Jurisdiction Coverage': 70,
      'Citation Quality': 48,
      'Risk Transparency': 58,
    },
    weightedScore: 57.3,
    tier: 'ACCEPTABLE',
    scoredAt: '2026-01-12T14:30:00Z',
  },
]

export const patternExtracts: PatternExtract[] = [
  {
    id: 'PE-001',
    jurisdiction: 'Singapore (MAS)',
    productType: 'Digital Payment Token (DPT)',
    riskDrivers: [
      'Retail exposure concentration',
      'Cross-border counterparty chains',
      'Stablecoin redemption runs',
    ],
    recurrentObligations: [
      'PS Act licensing (DPT provider)',
      'Travel Rule compliance (IRDA)',
      'Annual AML/CFT independent audit',
      'Customer asset segregation',
    ],
    controlWeaknesses: [
      'Custody policy gaps for hot wallet rotation',
      'Insufficient transaction monitoring for privacy coins',
      'Cross-entity exposure aggregation missing',
    ],
    timestamp: '2026-01-14T12:00:00Z',
  },
  {
    id: 'PE-002',
    jurisdiction: 'Cross-Border (SG/HK/JP)',
    productType: 'Decentralized Finance (DeFi) Protocol',
    riskDrivers: [
      'Jurisdictional arbitrage on settlement',
      'Smart contract exploit cascades',
      'Governance token concentration',
    ],
    recurrentObligations: [
      'VASP registration (where applicable)',
      'Protocol audit disclosure',
      'Cross-border notification (SFC/JFSA)',
    ],
    controlWeaknesses: [
      'No formal incident response for protocol freezes',
      'Oracle manipulation detection absent',
      'Cross-chain bridge risk unmonitored',
    ],
    timestamp: '2026-01-13T15:30:00Z',
  },
  {
    id: 'PE-003',
    jurisdiction: 'United Kingdom (FCA)',
    productType: 'Consumer Crypto Wallet',
    riskDrivers: [
      'Unsuitable investment recommendations',
      'Complex fee structures obscuring costs',
      'Inadequate complaint handling',
    ],
    recurrentObligations: [
      'Consumer Duty compliance (FCA)',
      'Financial promotions restrictions',
      'Complaints-handling procedure (DISP)',
      'Vulnerable customer safeguards',
    ],
    controlWeaknesses: [
      'Suitability assessment not triggered for <500 GBP',
      'No automated complaints escalation to FOS',
      'Marketing material review backlog 14 days',
    ],
    timestamp: '2026-01-12T09:00:00Z',
  },
]

export const escalationItems: EscalationItem[] = [
  {
    id: 'ES-001',
    priority: 'P1',
    title: 'DPT Licence Application — Retail Safeguards',
    description:
      'MAS has requested enhanced custody arrangements and 48-hour cooling-off period for retail DPT access before licence grant.',
    jurisdiction: 'Singapore',
    dueDate: '2026-01-22',
    status: 'in_progress',
  },
  {
    id: 'ES-002',
    priority: 'P2',
    title: 'Cross-Border SFC Notification',
    description:
      'Virtual asset trading platform activities triggering licensing requirements in Hong Kong. Notification deadline approaching.',
    jurisdiction: 'Hong Kong',
    dueDate: '2026-02-05',
    status: 'open',
  },
  {
    id: 'ES-003',
    priority: 'P1',
    title: 'DeFi Protocol VASP Assessment',
    description:
      'Regulatory sandbox application for DeFi lending protocol. MAS seeking clarification on governance token utility and decentralisation claims.',
    jurisdiction: 'Singapore',
    dueDate: '2026-01-28',
    status: 'open',
  },
]

export const driftEvents: DriftEvent[] = [
  {
    id: 'DE-001',
    productId: 'PROD-DPT-Retail-01',
    previousScore: 52,
    currentScore: 58,
    driftMagnitude: 6,
    postureChange: 'MAS enforcement action on unlicensed DPT providers increased scrutiny baseline. Retail safeguard expectations raised.',
    timestamp: '2026-01-10T08:00:00Z',
  },
  {
    id: 'DE-002',
    productId: 'PROD-DeFi-Lend-03',
    previousScore: 63,
    currentScore: 71,
    driftMagnitude: 8,
    postureChange: 'Cross-chain bridge exploit (250M USD) triggered emergency FSB guidance. DeFi protocols now subject to enhanced systemic risk assessment.',
    timestamp: '2026-01-08T14:00:00Z',
  },
]

export const controlInvestments: ControlInvestment[] = [
  {
    controlName: 'Automated Travel Rule Screening',
    priority: 1,
    estimatedCost: 'SGD 420K',
    riskReduction: 35,
    jurisdictions: ['Singapore', 'Hong Kong', 'Japan'],
  },
  {
    controlName: 'Real-Time Custody Segregation Monitor',
    priority: 2,
    estimatedCost: 'SGD 680K',
    riskReduction: 28,
    jurisdictions: ['Singapore', 'UK'],
  },
]

export const factPackets: FactPacket[] = [
  {
    id: 'FP-001',
    jurisdiction: 'Singapore',
    regulator: 'MAS',
    activityType: 'DPT Licence Grant',
    productClass: 'Digital Payment Token',
    riskLevel: 'medium',
    timestamp: '2026-01-14T10:00:00Z',
  },
  {
    id: 'FP-002',
    jurisdiction: 'United Kingdom',
    regulator: 'FCA',
    activityType: 'Consumer Duty Review',
    productClass: 'Crypto Wallet',
    riskLevel: 'high',
    timestamp: '2026-01-13T16:30:00Z',
  },
  {
    id: 'FP-003',
    jurisdiction: 'Hong Kong',
    regulator: 'SFC',
    activityType: 'VASP Licensing',
    productClass: 'Virtual Asset Trading',
    riskLevel: 'medium',
    timestamp: '2026-01-12T09:00:00Z',
  },
  {
    id: 'FP-004',
    jurisdiction: 'United States',
    regulator: 'SEC',
    activityType: 'Enforcement Action',
    productClass: 'DeFi Protocol',
    riskLevel: 'critical',
    timestamp: '2026-01-11T11:00:00Z',
  },
]

export const allMockData = {
  systemLayers,
  stressResults,
  credibilityEntries,
  patternExtracts,
  escalationItems,
  driftEvents,
  controlInvestments,
  factPackets,
}
