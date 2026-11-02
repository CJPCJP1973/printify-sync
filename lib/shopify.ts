const domain = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

const API_VERSION = '2025-10'

export type ShopifyImage = { url: string; altText: string | null; width: number; height: number }
export type ShopifyVariant = { id: string; title: string; availableForSale: boolean; quantityAvailable: number | null; price: { amount: string; currencyCode: string }; selectedOptions: { name: string; value: string }[] }
export type ShopifyProduct = { id: string; handle: string; title: string; description: string; descriptionHtml: string; createdAt: string; productType: string; tags: string[]; featuredImage: ShopifyImage | null; images: ShopifyImage[]; variants: ShopifyVariant[]; priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string; currencyCode: string } } }
export type ShopifyCollection = { id: string; handle: string; title: string; description: string; image: ShopifyImage | null; products: ShopifyProduct[] }

const PRODUCT_FIELDS = `id handle title description descriptionHtml createdAt productType tags featuredImage { url altText width height } images(first: 10) { nodes { url altText width height } } variants(first: 100) { nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }`

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}) {
  if (!domain || !token) throw new Error('Shopify storefront configuration is missing')
  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token }, body: JSON.stringify({ query, variables }), next: { revalidate: 60 } })
  if (!response.ok) throw new Error(`Shopify request failed: ${response.status}`)
  const result = await response.json() as { data?: T; errors?: { message: string }[] }
  if (result.errors?.length || !result.data) throw new Error(result.errors?.[0]?.message ?? 'Shopify returned no data')
  return result.data
}

export async function getProducts(first = 24) {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(`query Products($first: Int!) { products(first: $first, sortKey: CREATED_AT, reverse: true) { nodes { ${PRODUCT_FIELDS} } } }`, { first })
  return data.products.nodes
}

export async function getProduct(handle: string) {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(`query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`, { handle })
  return data.product
}

export async function getCollections(first = 12) {
  const data = await shopifyFetch<{ collections: { nodes: ShopifyCollection[] } }>(`query Collections($first: Int!) { collections(first: $first) { nodes { id handle title description image { url altText width height } products(first: 4) { nodes { ${PRODUCT_FIELDS} } } } } }`, { first })
  return data.collections.nodes
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartCreate: { cart: { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyCartLine[] } }; userErrors: { message: string }[] } }>(`mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { message } } }`, { input: { lines } })
}

export type ShopifyCartLine = { id: string; quantity: number; merchandise: { id: string; title: string; product: { title: string; handle: string; featuredImage: ShopifyImage | null }; price: { amount: string; currencyCode: string } } }
const CART_FIELDS = `id checkoutUrl totalQuantity lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id title product { title handle featuredImage { url altText width height } } price { amount currencyCode } } } } }`

export async function getCart(id: string) {
  const data = await shopifyFetch<{ cart: { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyCartLine[] } } | null }>(`query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id })
  return data.cart
}

export async function updateCart(id: string, lines: { id: string; quantity: number }[]) {
  return shopifyFetch<{ cartLinesUpdate: { cart: { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyCartLine[] } }; userErrors: { message: string }[] } }>(`mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId: id, lines })
}

export async function addCartLines(id: string, lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartLinesAdd: { cart: { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyCartLine[] } }; userErrors: { message: string }[] } }>(`mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId: id, lines })
}

export async function removeCartLines(id: string, lineIds: string[]) {
  return shopifyFetch<{ cartLinesRemove: { cart: { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyCartLine[] } }; userErrors: { message: string }[] } }>(`mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`, { cartId: id, lineIds })
}
