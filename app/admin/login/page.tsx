'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message.toLowerCase().includes('confirm')
        ? 'Please confirm your email before signing in.'
        : 'Invalid email or password.')
      setIsSubmitting(false)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <main className="admin-shell admin-login-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/">DH / Admin</Link>
        <span className="admin-badge">Private access</span>
      </header>

      <section className="admin-login-card" aria-labelledby="login-title">
        <p className="admin-kicker">Administrator sign in</p>
        <h1 id="login-title">Enter <em>God Mode.</em></h1>
        <p className="admin-login-intro">Use the approved administrator account to manage Dog Hunters Apparel.</p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>

      <footer className="admin-footer">
        <Link className="admin-link" href="/">Return to storefront</Link>
        <span>Authenticated session required</span>
      </footer>
    </main>
  )
}
