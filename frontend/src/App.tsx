import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from './components/AuthForm'
import Survey from './components/Survey'
import Review from './components/Review'
import { api, setToken } from './api'

type View = 'welcome'|'login'|'register'|'survey'|'review'

export default function App() {
  const [view, setView] = useState<View>('welcome')
  const [user, setUser] = useState<any>(null)
  const [response, setResponse] = useState<any>(null)

  useEffect(() => {
    api.me().then(r => setUser(r.user)).catch(() => {})
  }, [])

  function logout() {
    setToken(null)
    setUser(null)
    setView('welcome')
  }

  return (
    <div className="container">
      <header className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold">Survey App</div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setView('login')}>Login</button>
              <button className="btn" onClick={() => setView('register')}>Register</button>
            </>
          )}
        </div>
      </header>

      {view === 'welcome' && (
        <div className="card space-y-3">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-gray-600">Sign up or log in to start the intake survey.</p>
          <div className="flex gap-2">
            <button className="btn" onClick={() => setView('register')}>Create account</button>
            <button className="btn" onClick={() => setView('login')}>I already have an account</button>
          </div>
        </div>
      )}

      {view === 'login' && <AuthForm mode="login" onSuccess={() => { api.me().then(r=>setUser(r.user)); setView('survey') }} />}
      {view === 'register' && <AuthForm mode="register" onSuccess={() => { api.me().then(r=>setUser(r.user)); setView('survey') }} />}

      {view === 'survey' && user && <Survey onSubmitted={(resp) => { setResponse(resp); setView('review') }} />}
      {view === 'review' && response && <Review response={response} />}

      <footer className="mt-10 text-center text-xs text-gray-500">
        
      </footer>
    </div>
  )
}