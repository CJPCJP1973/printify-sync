import Link from 'next/link'
import { getAdminOnly } from '@/lib/supabase/server'

export default async function AdminPage() {
  const user = await getAdminOnly()

  if (!user) {
    return (
      <main className="admin-shell admin-denied">
        <p className="admin-kicker">Dog Hunters Apparel</p>
        <h1>Admin access required.</h1>
        <p>Sign in with the approved administrator account to enter God Mode.</p>
        <Link className="admin-link" href="/">Return to the storefront</Link>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/">DH / Admin</Link>
        <span className="admin-badge">God Mode</span>
      </header>

      <section className="admin-hero" aria-labelledby="admin-title">
        <p className="admin-kicker">Private control room</p>
        <h1 id="admin-title">Welcome to<br /><em>God Mode.</em></h1>
        <p>Signed in as <strong>{user.email}</strong>. This protected space is ready for store controls, orders, and content management.</p>
      </section>

      <section className="admin-grid" aria-label="Admin controls">
        <Link className="admin-card admin-card-action" href="/admin/design">
          <span className="admin-card-label">Product studio</span>
          <strong>Design</strong>
          <span>Create a Printify product mockup →</span>
        </Link>
        <article className="admin-card admin-card-live">
          <span className="admin-card-label">Store status</span>
          <strong>Live</strong>
          <span>Printify pop-up connected</span>
        </article>
        <article className="admin-card">
          <span className="admin-card-label">Access level</span>
          <strong>Owner</strong>
          <span>Full administrative access</span>
        </article>
        <article className="admin-card">
          <span className="admin-card-label">Next control</span>
          <strong>Orders</strong>
          <span>Connect order management when ready</span>
        </article>
      </section>

      <footer className="admin-footer">
        <Link className="admin-link" href="/">View storefront</Link>
        <span>Authenticated session required</span>
      </footer>
    </main>
  )
}
