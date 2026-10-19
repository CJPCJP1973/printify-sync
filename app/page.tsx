import { CheckoutButton } from '@/components/checkout-button'
import { ShopifyProducts } from '@/components/shopify-products'
import { getProducts } from '@/lib/shopify'

const storeUrl = process.env.SHOPIFY_STORE_DOMAIN
  ? `https://${process.env.SHOPIFY_STORE_DOMAIN}`
  : 'https://dog-hunters-apparel.printify.me'

export default async function Page() {
  const products = await getProducts()
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
        <div className="hero-actions">
          <CheckoutButton productId="field-tee" />
          <a className="collection-link" href={storeUrl} target="_blank" rel="noreferrer">
            Browse the Printify collection <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <ShopifyProducts products={products} />

      <footer className="site-footer">
        <span>Dog Hunters Apparel</span>
        <span>Est. for the field · 2026</span>
      </footer>
    </main>
  )
}

