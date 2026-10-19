const SHOPIFY_API_VERSION = '2026-01'

const shopDomain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  onlineStoreUrl: string | null
  image: { url: string; altText: string | null } | null
  price: { amount: string; currencyCode: string }
}

interface ShopifyResponse {
  data?: {
    products: {
      nodes: Array<{
        id: string
        handle: string
        title: string
        description: string
        onlineStoreUrl: string | null
        featuredImage: ShopifyProduct['image']
        priceRange: { minVariantPrice: ShopifyProduct['price'] }
      }>
    }
  }
  errors?: Array<{ message: string }>
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  if (!shopDomain || !storefrontToken) return []

  const response = await fetch(`https://${shopDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({
      query: `query Products { products(first: 12, sortKey: BEST_SELLING) { nodes { id handle title description onlineStoreUrl featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } } } }`,
    }),
    next: { revalidate: 300 },
  })

  if (!response.ok) return []

  const result = (await response.json()) as ShopifyResponse
  if (result.errors?.length) return []

  return result.data?.products.nodes.map((product) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    onlineStoreUrl: product.onlineStoreUrl,
    image: product.featuredImage,
    price: product.priceRange.minVariantPrice,
  })) ?? []
}
