import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdminEmail, requireUser } from '@/lib/supabase/server'

export default async function AdminPage() {
  const user = await requireUser()
  if (!user) redirect('/admin/login')
  if (!isAdminEmail(user.email)) {
    return (
      <main className="admin-shell admin-denied">
        <p className="admin-kicker">Dog Hunters Apparel</p>
        <h1>Admin access required.</h1>
        <p>This account is signed in but is not authorized to access the administrator area.</p>
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
          <span>Create a product concept preview (not yet published to Printify) →</span>
        </Link>
        <article className="admin-card">
          <span className="admin-card-label">Store integration</span>
          <strong>Needs verification</strong>
          <span>Confirm Printify credentials and fulfillment workflow before describing the store as connected.</span>
        </article>
        <article className="admin-card">
          <span className="admin-card-label">Access level</span>
          <strong>Owner</strong>
          <span>Administrator access is checked on the server.</span>
        </article>
        <article className="admin-card">
          <span className="admin-card-label">Next control</span>
          <strong>Orders</strong>
          <span>Order persistence and fulfillment automation are not implemented yet.</span>
        </article>
      </section>

      <footer className="admin-footer">
        <Link className="admin-link" href="/">View storefront</Link>
        <span>Authenticated administrator session required</span>
      </footer>
    </main>
  )
}
