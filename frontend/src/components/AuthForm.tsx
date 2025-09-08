import React, { useState } from 'react'
import { api, setToken } from '../api'

export default function AuthForm({ mode, onSuccess }: { mode: 'login'|'register'; onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const fn = mode === 'login' ? api.login : api.register
      const { token } = await fn({ email, password })
      setToken(token)
      onSuccess()
    } catch (e:any) {
      setError(e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password (min 6 chars)</label>
        <input className="input" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required />
      </div>
      {error && <div className="error">{error}</div>}
      <button className="btn w-full" disabled={loading}>{loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Register')}</button>
    </form>
  )
}