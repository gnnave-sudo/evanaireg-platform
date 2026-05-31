import type {
  VosAgent,
  StressScenario,
  PomeloTransaction,
  ComplianceObligation,
  RiskFlag,
  NLQueryExample,
} from '@/types/vos'

/* ── Vos Agents ── */

export const vosAgents: VosAgent[] = [
  {
    id: 'RIE',
    name: 'Regulatory Intelligence Engine',
    shortName: 'RIE',
    status: 'Active',
    statLabel: 'Queries/hr',
    statValue: '47',
    description:
      'Maintains curated regulation store covering LFPIORPI, LRITF, Banxico Law. Maps obligations to owners and deadlines. Produces monthly Regulatory Horizon briefing.',
    tools: [
      'regulation_search',
      'obligation_mapper',
      'horizon_scanner',
      'diff_analyzer',
    ],
    icon: 'globe',
  },
  {
    id: 'TMA',
    name: 'Transaction Monitoring Agent',
    shortName: 'TMA',
    status: 'Active',
    statLabel: 'Events/hr',
    statValue: '124',
    description:
      'Monitors Pomelo webhook events for threshold triggers. Screens against UIF PEP list and OFAC SDN. Generates draft avisos when 210 UMA threshold is crossed.',
    tools: [
      'pomelo_event_ingest',
      'threshold_tracker',
      'pep_screener',
      'travel_rule_checker',
      'aviso_drafter',
    ],
    icon: 'credit-card',
  },
  {
    id: 'RE',
    name: 'Reporting Engine',
    shortName: 'RE',
    status: 'Active',
    statLabel: 'Reports/day',
    statValue: '8',
    description:
      'Compliance calendar for all SAT, UIF, CNBV, and Pomelo obligations. Drafts PLD portal reports, ISR pre-fill, zero-activity monthly reports, AML audit packages.',
    tools: [
      'calendar_tracker',
      'report_builder',
      'fee_reconciler',
      'tax_prefill',
      'audit_packager',
    ],
    icon: 'file-text',
  },
  {
    id: 'ICCA',
    name: 'Intercompany & Contract Compliance',
    shortName: 'ICCA',
    status: 'Active',
    statLabel: 'Checks/day',
    statValue: '12',
    description:
      'Monitors Bybit-Vortex Collateral Contract, intercompany fee annex, POA status, legal representative transition, bank account settlement.',
    tools: [
      'contract_tracker',
      'annex_reconciler',
      'corporate_register',
      'poa_monitor',
    ],
    icon: 'handshake',
  },
]

/* ── Mexico LFPIORPI Stress Scenarios ── */

export const mexicoStressScenarios: StressScenario[] = [
  {
    id: 'MEX-001',
    name: 'DPT Licence Application (Retail Safeguards)',
    overallRisk: 58,
    recommendation: 'HOLD',
    businessAdvocate:
      'Pursue full DPT licence — market opportunity substantial, regulatory framework navigable.',
    complianceReviewer:
      'Strong AML/CFT controls but retail access requires enhanced custody and cooling-off periods.',
    regulatorProxy:
      'MAS expects explicit counterparty risk disclosure, travel rule compliance non-negotiable.',
    neutralAdjudicator:
      'Risk-adjusted pathway: conditional approval with phased retail rollout.',
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
  },
  {
    id: 'MEX-002',
    name: 'DeFi Protocol VASP Assessment',
    overallRisk: 71,
    recommendation: 'NO-GO',
    businessAdvocate:
      'DeFi structure falls outside traditional DPT licensing — sandbox entry opportunity.',
    complianceReviewer:
      'Smart contract audit gaps, cross-border jurisdictional overlap on settlement finality.',
    regulatorProxy:
      'Novel product class requires bespoke framework, existing PS Act may not capture protocol-level risks.',
    neutralAdjudicator:
      'High uncertainty across multiple dimensions, recommend no-go pending regulatory clarity.',
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
  },
  {
    id: 'MEX-003',
    name: 'Cross-Border Card Processing (Pomelo/Mastercard)',
    overallRisk: 48,
    recommendation: 'PROCEED',
    businessAdvocate:
      'Pomelo BIN sponsor arrangement provides clear Mastercard network pathway.',
    complianceReviewer:
      'AML policy submitted, transaction reporting framework operational, Annex 4/5 in preparation.',
    regulatorProxy:
      'CNBV registration process standard for card issuers, 10-month timeline manageable.',
    neutralAdjudicator:
      'Proceed with standard CNBV registration, maintain quarterly attestations.',
    dimensions: {
      'AML/CFT': 75,
      Custody: 80,
      Disclosure: 70,
      'Travel Rule': 60,
      'Consumer Protection': 65,
      'Market Abuse': 70,
      'Systemic Risk': 45,
      'Cyber Resilience': 75,
      'Operational Risk': 60,
      'Legal Certainty': 68,
    },
  },
]

/* ── Pomelo Transactions ── */

export const pomeloTransactions: PomeloTransaction[] = [
  {
    id: 'TX-20260520-01',
    amount: 'MXN 4,200',
    rawAmount: 4200,
    type: 'FX Fee',
    status: 'Settled',
    risk: 'CLEAR',
  },
  {
    id: 'TX-20260520-02',
    amount: 'MXN 18,500',
    rawAmount: 18500,
    type: 'ATM Withdraw',
    status: 'Settled',
    risk: 'CLEAR',
  },
  {
    id: 'TX-20260520-03',
    amount: 'MXN 23,100',
    rawAmount: 23100,
    type: 'FX Fee',
    status: 'Pending',
    risk: 'FLAG',
    thresholdRef: '210 UMA threshold',
  },
  {
    id: 'TX-20260520-04',
    amount: 'MXN 1,200',
    rawAmount: 1200,
    type: 'Interchange',
    status: 'Settled',
    risk: 'CLEAR',
  },
  {
    id: 'TX-20260520-05',
    amount: 'MXN 890',
    rawAmount: 890,
    type: 'FX Fee',
    status: 'Settled',
    risk: 'CLEAR',
  },
]

/* ── Compliance Calendar ── */

export const complianceObligations: ComplianceObligation[] = [
  {
    id: 'OB-001',
    name: 'PLD Portal — zero-activity report',
    frequency: 'Monthly',
    deadline: 'Last business day',
    owner: 'Compliance Officer',
    status: 'Due Soon',
    detail: 'Due in 8 days',
  },
  {
    id: 'OB-002',
    name: 'PLD Portal — threshold aviso',
    frequency: 'Per-event',
    deadline: 'Within 30 days',
    owner: 'Compliance Officer',
    status: 'CRITICAL',
    detail: '1 pending',
  },
  {
    id: 'OB-003',
    name: 'Travel Rule validation',
    frequency: 'Per-transaction',
    deadline: 'Real-time',
    owner: 'TMA automated',
    status: 'Active',
  },
  {
    id: 'OB-004',
    name: 'PEP/sanctions screening',
    frequency: 'Per-event',
    deadline: 'Real-time',
    owner: 'TMA automated',
    status: 'Active',
  },
  {
    id: 'OB-005',
    name: 'Annual AML Audit',
    frequency: 'Annual',
    deadline: 'Year-end 2026',
    owner: 'External auditor + BGBG',
    status: 'Scheduled',
  },
  {
    id: 'OB-006',
    name: 'Annual ISR Tax Return',
    frequency: 'Annual',
    deadline: 'March 31',
    owner: 'VSA (Enrique Velderrain)',
    status: 'Scheduled',
    detail: 'Due in 315 days',
  },
  {
    id: 'OB-007',
    name: 'Intercompany fee reconciliation',
    frequency: 'Quarterly',
    deadline: '30 days post-Q',
    owner: 'Finance + BTL (Adam Yip)',
    status: 'Due Soon',
    detail: 'Q2 pending',
  },
  {
    id: 'OB-008',
    name: 'Corporate document review',
    frequency: 'Annual',
    deadline: 'December',
    owner: 'BGBG + Legal Rep',
    status: 'Scheduled',
  },
  {
    id: 'OB-009',
    name: 'POA / e-firma renewal',
    frequency: 'As needed',
    deadline: '30 days before expiry',
    owner: 'Legal Rep',
    status: 'CRITICAL',
    detail: 'CRITICAL',
  },
  {
    id: 'OB-010',
    name: 'Bybit Collateral Contract renewal',
    frequency: 'Annual',
    deadline: 'January 1',
    owner: 'Ernesto Santiago G',
    status: 'Active',
    detail: 'Auto-renews',
  },
  {
    id: 'OB-011',
    name: 'Regulatory horizon review',
    frequency: 'Monthly',
    deadline: 'First week',
    owner: 'RIE automated',
    status: 'Due Soon',
    detail: 'Due in 12 days',
  },
]

/* ── Risk Flags ── */

export const riskFlags: RiskFlag[] = [
  {
    id: 'CR-001',
    risk: 'Crypto Revenue Exposure — conversion fee on Vortex books',
    severity: 'CRITICAL',
    status: 'MONITORING',
  },
  {
    id: 'CR-002',
    risk: 'BBVA Account Deactivated — settlement gap risk',
    severity: 'HIGH',
    status: 'ACTIVE',
  },
  {
    id: 'CR-003',
    risk: 'Legal Representative Transition — POA pending',
    severity: 'CRITICAL',
    status: 'ESCALATED',
  },
  {
    id: 'CR-004',
    risk: '2025 Revenue Recognition — Adam Yip figures dependency',
    severity: 'HIGH',
    status: 'PENDING',
  },
  {
    id: 'CR-005',
    risk: 'Automated Monitoring Systems — July 2025 reform obligation',
    severity: 'CRITICAL',
    status: 'COMPLIANT (Vos deployed)',
  },
  {
    id: 'CR-006',
    risk: '210 UMA Threshold — per-operation + cumulative 6-month',
    severity: 'HIGH',
    status: 'ACTIVE',
  },
  {
    id: 'CR-007',
    risk: 'Cross-Border Settlement — jurisdictional arbitrage on settlement',
    severity: 'MEDIUM',
    status: 'MONITORING',
  },
]

/* ── NL Query Examples ── */

export const nlQueryExamples: NLQueryExample[] = [
  {
    query: 'What AML reports are due in the next 30 days?',
    procedure: 'PROC-001',
  },
  {
    query: 'Draft an aviso for a 50,000 MXN FX fee',
    procedure: 'PROC-002',
  },
  {
    query: 'Check 2025 ISR revenue summary',
    procedure: 'PROC-003',
  },
  {
    query: 'What is the current POA status?',
    procedure: 'PROC-005',
  },
  {
    query: 'Monitor CNBV card issuer registry',
    procedure: 'PROC-006',
  },
]

/* ── Threshold Status ── */

export const thresholdStatus = {
  label: 'Rolling 6-month',
  current: 89400,
  limit: 21000,
  percentage: 425,
  unit: 'MXN',
  umaNote: '210 UMA',
}

export const pepScreeningStatus = {
  lastScan: '2 minutes ago',
  matches: 0,
}

/* ── Helper: build radar data for Mexico scenarios ── */

export function buildMexicoRadarData(scenarios: StressScenario[]) {
  if (!scenarios.length) return []
  const dims = Object.keys(scenarios[0].dimensions)
  return dims.map((dim) => {
    const row: Record<string, string | number> = { dimension: dim }
    scenarios.forEach((s) => {
      row[s.name] = s.dimensions[dim] ?? 0
    })
    return row
  })
}
