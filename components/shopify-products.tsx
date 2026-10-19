import type { ShopifyProduct } from '@/lib/shopify'

function formatPrice(price: ShopifyProduct['price']) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(Number(price.amount))
}

export function ShopifyProducts({ products }: { products: ShopifyProduct[] }) {
  if (!products.length) return null

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog-heading">
        <p className="eyebrow">From the Shopify collection</p>
        <h2 id="catalog-title">Made for the pack.</h2>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            {product.image ? (
              <img src={product.image.url} alt={product.image.altText || product.title} />
            ) : (
              <div className="product-image-empty" aria-hidden="true" />
            )}
            <div className="product-info">
              <div>
                <h3>{product.title}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
              {product.onlineStoreUrl && (
                <a href={product.onlineStoreUrl} target="_blank" rel="noreferrer">
                  View product <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
