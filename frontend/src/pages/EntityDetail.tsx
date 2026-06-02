import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Globe,
  Shield,
  AlertTriangle,
  Activity,
  ChevronLeft,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import {
  getEntity,
  getEntityJurisdictions,
  getEntityRules,
  getEntityThresholds,
  type EntityDetail,
  type Jurisdiction,
  type ComplianceRule,
  type Threshold,
} from '@/lib/api'

type TabKey = 'overview' | 'jurisdictions' | 'rules' | 'thresholds'

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: Building2 },
  { key: 'jurisdictions', label: 'Jurisdictions', icon: Globe },
  { key: 'rules', label: 'Compliance Rules', icon: Shield },
  { key: 'thresholds', label: 'Thresholds', icon: TrendingUp },
]

function severityColor(sev: string) {
  switch (sev?.toUpperCase()) {
    case 'CRITICAL':
      return 'text-red-400 border-red-400/30 bg-red-400/10'
    case 'HIGH':
      return 'text-orange-400 border-orange-400/30 bg-orange-400/10'
    case 'MEDIUM':
      return 'text-warm-amber border-warm-amber/30 bg-warm-amber/10'
    default:
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
  }
}

function statusColor(st: string) {
  return st === 'active' || st === 'completed'
    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    : 'text-red-400 border-red-400/30 bg-red-400/10'
}

export default function EntityDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [entity, setEntity] = useState<EntityDetail | null>(null)
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([])
  const [rules, setRules] = useState<ComplianceRule[]>([])
  const [thresholds, setThresholds] = useState<Threshold[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError('')
    Promise.all([
      getEntity(slug),
      getEntityJurisdictions(slug),
      getEntityRules(slug),
      getEntityThresholds(slug),
    ])
      .then(([e, j, r, t]) => {
        setEntity(e)
        setJurisdictions(j.jurisdictions || [])
        setRules(r.rules || [])
        setThresholds(t.thresholds || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian text-soft-cream">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-warm-amber animate-spin" />
          <span className="font-mono text-sm text-muted-sand">Loading entity…</span>
        </div>
      </div>
    )
  }

  if (error || !entity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian text-soft-cream">
        <div className="text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-xl mb-2">Entity not found</h2>
          <p className="font-mono text-sm text-muted-sand mb-6">{error || `No entity with slug "${slug}"`}</p>
          <button
            onClick={() => navigate('/')}
            className="font-body text-sm bg-warm-amber text-obsidian px-4 py-2 rounded-lg hover:scale-[1.03] transition-transform"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian text-soft-cream px-5 md:px-12 py-8">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-sand hover:text-soft-cream transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          <span className="font-body text-sm">Back to Dashboard</span>
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={22} className="text-warm-amber" />
              <h1 className="font-display text-[28px] md:text-[36px] text-soft-cream">{entity.name}</h1>
            </div>
            <p className="font-mono text-sm text-muted-sand">{entity.legal_name || entity.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusColor(entity.status)}`}
            >
              {entity.status?.toUpperCase()}
            </span>
            <span className="font-mono text-[11px] text-muted-sand bg-surface-dark border border-subtle-line px-2.5 py-1 rounded-full">
              {entity.industry}
            </span>
            <span className="font-mono text-[11px] text-muted-sand">ID: {entity.id}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <StatCard icon={Globe} label="Jurisdictions" value={jurisdictions.length} />
          <StatCard icon={Shield} label="Rules" value={rules.length} />
          <StatCard icon={TrendingUp} label="Thresholds" value={thresholds.length} />
          <StatCard
            icon={rules.some((r) => r.severity === 'CRITICAL' || r.severity === 'HIGH') ? AlertTriangle : CheckCircle2}
            label="Risk Level"
            value={
              rules.some((r) => r.severity === 'CRITICAL')
                ? 'CRITICAL'
                : rules.some((r) => r.severity === 'HIGH')
                  ? 'HIGH'
                  : 'NORMAL'
            }
            accent={
              rules.some((r) => r.severity === 'CRITICAL')
                ? 'text-red-400'
                : rules.some((r) => r.severity === 'HIGH')
                  ? 'text-orange-400'
                  : 'text-emerald-400'
            }
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1280px] mx-auto">
        <div className="flex gap-1 mb-6 border-b border-subtle-line pb-px overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 font-body text-[13px] whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'text-warm-amber border-warm-amber'
                    : 'text-muted-sand border-transparent hover:text-soft-cream'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <OverviewTab entity={entity} jurisdictions={jurisdictions} rules={rules} thresholds={thresholds} />}
          {activeTab === 'jurisdictions' && <JurisdictionsTab jurisdictions={jurisdictions} />}
          {activeTab === 'rules' && <RulesTab rules={rules} />}
          {activeTab === 'thresholds' && <ThresholdsTab thresholds={thresholds} />}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="bg-surface-dark border border-subtle-line rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={accent || 'text-muted-sand'} />
        <span className="font-mono text-[10px] uppercase text-muted-sand tracking-wider">{label}</span>
      </div>
      <span className={`font-mono text-[22px] font-bold ${accent || 'text-soft-cream'}`}>{value}</span>
    </div>
  )
}

function OverviewTab({
  entity,
  jurisdictions,
  rules,
  thresholds,
}: {
  entity: EntityDetail
  jurisdictions: Jurisdiction[]
  rules: ComplianceRule[]
  thresholds: Threshold[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
        <h3 className="font-body font-semibold text-[15px] text-soft-cream mb-4">Entity Details</h3>
        <div className="space-y-3">
          <DetailRow label="Slug" value={entity.slug} />
          <DetailRow label="Legal Name" value={entity.legal_name || '-'} />
          <DetailRow label="Industry" value={entity.industry || '-'} />
          <DetailRow label="Status" value={entity.status || '-'} />
          <DetailRow label="Created" value={entity.created_at ? new Date(entity.created_at).toLocaleDateString() : '-'} />
          <DetailRow label="Updated" value={entity.updated_at ? new Date(entity.updated_at).toLocaleDateString() : '-'} />
        </div>
      </div>

      <div className="bg-surface-dark border border-subtle-line rounded-xl p-5">
        <h3 className="font-body font-semibold text-[15px] text-soft-cream mb-4">Quick Summary</h3>
        <div className="space-y-4">
          <SummaryItem icon={Globe} label="Active Jurisdictions" count={jurisdictions.filter((j) => j.status === 'active').length} total={jurisdictions.length} />
          <SummaryItem icon={Shield} label="Active Rules" count={rules.filter((r) => r.status === 'active').length} total={rules.length} />
          <SummaryItem icon={TrendingUp} label="Active Thresholds" count={thresholds.filter((t) => t.status === 'active').length} total={thresholds.length} />
          <SummaryItem icon={AlertTriangle} label="High/Critical Rules" count={rules.filter((r) => r.severity === 'HIGH' || r.severity === 'CRITICAL').length} total={rules.length} accent="text-orange-400" />
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-subtle-line/50 last:border-0">
      <span className="font-mono text-[11px] text-muted-sand uppercase tracking-wider">{label}</span>
      <span className="font-body text-[13px] text-soft-cream">{value}</span>
    </div>
  )
}

function SummaryItem({
  icon: Icon,
  label,
  count,
  total,
  accent,
}: {
  icon: React.ElementType
  label: string
  count: number
  total: number
  accent?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className={accent || 'text-muted-sand'} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-body text-[13px] text-soft-cream">{label}</span>
          <span className={`font-mono text-[13px] font-bold ${accent || 'text-soft-cream'}`}>
            {count}/{total}
          </span>
        </div>
        <div className="h-1.5 bg-obsidian rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${accent ? 'bg-orange-400' : 'bg-warm-amber'}`}
            style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function JurisdictionsTab({ jurisdictions }: { jurisdictions: Jurisdiction[] }) {
  if (jurisdictions.length === 0) {
    return <EmptyState icon={Globe} message="No jurisdictions registered for this entity." />
  }
  return (
    <div className="space-y-3">
      {jurisdictions.map((j) => (
        <div key={j.id} className="bg-surface-dark border border-subtle-line rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-body font-medium text-[14px] text-soft-cream">{j.jurisdiction_name || j.jurisdiction_code}</div>
            <div className="font-mono text-[11px] text-muted-sand mt-0.5">Code: {j.jurisdiction_code} • Type: {j.entity_type || 'N/A'}</div>
          </div>
          <div className="flex items-center gap-3">
            {j.registered_date && (
              <span className="font-mono text-[10px] text-muted-sand flex items-center gap-1">
                <Clock size={10} />
                {new Date(j.registered_date).toLocaleDateString()}
              </span>
            )}
            <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${statusColor(j.status)}`}>{j.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RulesTab({ rules }: { rules: ComplianceRule[] }) {
  if (rules.length === 0) {
    return <EmptyState icon={Shield} message="No compliance rules configured for this entity." />
  }
  return (
    <div className="space-y-3">
      {rules.map((r) => (
        <div key={r.id} className="bg-surface-dark border border-subtle-line rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="font-body font-medium text-[14px] text-soft-cream truncate">{r.rule_name || r.rule_type}</div>
              <div className="font-mono text-[11px] text-muted-sand mt-0.5">Type: {r.rule_type} • Jurisdiction: {r.jurisdiction_code || 'Global'}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${severityColor(r.severity)}`}>{r.severity}</span>
              <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${statusColor(r.status)}`}>{r.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ThresholdsTab({ thresholds }: { thresholds: Threshold[] }) {
  if (thresholds.length === 0) {
    return <EmptyState icon={TrendingUp} message="No thresholds configured for this entity." />
  }
  return (
    <div className="space-y-3">
      {thresholds.map((t) => (
        <div key={t.id} className="bg-surface-dark border border-subtle-line rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-body font-medium text-[14px] text-soft-cream">{t.threshold_type}</div>
            <div className="font-mono text-[11px] text-muted-sand mt-0.5">
              Applies to: {t.applies_to || 'all'} • Jurisdiction: {t.jurisdiction_code || 'Global'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[14px] font-bold text-warm-amber">
              {t.threshold_value}
              {t.unit && <span className="text-[11px] text-muted-sand ml-1">{t.unit}</span>}
            </span>
            <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded border ${statusColor(t.status)}`}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-sand">
      <Icon size={32} className="mb-3 opacity-40" />
      <p className="font-body text-[14px]">{message}</p>
    </div>
  )
}
