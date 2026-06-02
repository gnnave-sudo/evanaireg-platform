import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, ArrowRight } from 'lucide-react'

export default function Login() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!key.trim()) {
      setError('Please enter an API key')
      return
    }
    // Validate key against health endpoint
    try {
      const resp = await fetch('/health', {
        headers: { Authorization: `Bearer ${key}` },
      })
      if (!resp.ok) throw new Error('Invalid API key')
      login(key)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-warm-amber/10 border border-warm-amber/20 mb-4">
            <Lock size={20} className="text-warm-amber" />
          </div>
          <h1 className="font-display text-[28px] text-soft-cream mb-2">EvanAIRegPlatform</h1>
          <p className="font-body text-[14px] text-muted-sand">Enter your API key to access the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-dark border border-subtle-line rounded-xl p-6 space-y-4">
          <div>
            <label className="block font-mono text-[11px] text-muted-sand uppercase tracking-wider mb-2">API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="evan-x870-local-key"
              className="w-full bg-obsidian border border-subtle-line rounded-lg px-4 py-3 font-body text-[14px] text-soft-cream placeholder:text-muted-sand/50 outline-none focus:border-warm-amber/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-warm-amber text-obsidian font-body font-semibold text-sm px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Access Platform
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center font-mono text-[11px] text-muted-sand mt-6">
          Default key: evan-x870-local-key
        </p>
      </div>
    </div>
  )
}
