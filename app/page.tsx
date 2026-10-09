const storeUrl = 'https://dog-hunters-apparel.printify.me'

export default function Page() {
  return (
    <main className="store-shell">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Dog Hunters Apparel home">
          <span className="brand-mark" aria-hidden="true">DH</span>
          <span>Dog Hunters<br />Apparel</span>
        </a>
        <div className="header-actions">
          <span className="status"><span className="status-dot" /> Pop-up store live</span>
          <a className="admin-button" href="/admin">Admin panel</a>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Built for the hunt</p>
        <h1 id="hero-title">Gear for the<br /><em>dog hunters</em></h1>
        <p className="intro">Field-tested spirit, made for the people who know that every great adventure starts with four paws.</p>
        <a className="shop-button" href={storeUrl} target="_blank" rel="noreferrer">
          Shop the collection <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <span>Dog Hunters Apparel</span>
        <span>Est. for the field · 2026</span>
      </footer>
    </main>
  )
}

