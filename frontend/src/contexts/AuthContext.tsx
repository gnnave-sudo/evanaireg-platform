import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthContextType {
  apiKey: string | null
  login: (key: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  apiKey: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem('evan_api_key')
  })

  const login = (key: string) => {
    localStorage.setItem('evan_api_key', key)
    setApiKey(key)
  }

  const logout = () => {
    localStorage.removeItem('evan_api_key')
    setApiKey(null)
  }

  useEffect(() => {
    const key = localStorage.getItem('evan_api_key')
    if (key) setApiKey(key)
  }, [])

  return (
    <AuthContext.Provider value={{ apiKey, login, logout, isAuthenticated: !!apiKey }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
