import { Component, type ReactNode, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import EvanAI from './pages/EvanAI'

/* ===== Scroll to top on route change ===== */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

/* ===== Page transition wrapper ===== */
function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div
      key={pathname}
      className="animate-fade-in"
    >
      {children}
    </div>
  )
}

/* ===== Error Boundary ===== */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-obsidian text-soft-cream p-8">
          <div className="text-center max-w-md">
            <h2 className="font-display text-h2 text-warm-amber mb-4">Something went wrong</h2>
            <p className="font-body text-body text-muted-sand mb-6">
              An unexpected error occurred. Try refreshing the page or check the console for details.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="font-body font-semibold text-sm bg-warm-amber text-obsidian px-6 py-3 rounded-lg hover:scale-[1.03] transition-transform"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 text-left text-xs font-mono text-muted-sand bg-surface-dark p-4 rounded-lg overflow-auto">
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<PageTransition><EvanAI /></PageTransition>} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}
