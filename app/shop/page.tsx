import { getCollections, getProducts, type ShopifyCollection, type ShopifyProduct } from '@/lib/shopify'
import { StoreShell } from '@/components/store-shell'
import { ShopControls } from '@/components/catalog'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify'

export const revalidate = 60
export default async function ShopPage() { let products: ShopifyProduct[] = []; let collections: ShopifyCollection[] = []; let error = false; try { [products, collections] = await Promise.all([getProducts(), getCollections()]) } catch { error = true } const cartId = (await cookies()).get('dog-hunters-cart')?.value; const cart = cartId ? await getCart(cartId).catch(() => null) : null; return <StoreShell initialCart={cart}><main className="content-shell"><div className="page-heading"><p className="eyebrow">The current collection</p><h1>Field-tested <em>gear.</em></h1><p>Built for long days, early starts, and the people who never leave the dogs behind.</p></div>{error ? <div className="empty-state"><p>Our field shelves are taking a breather.</p><a href="/shop">Try again</a></div> : <ShopControls products={products} collections={collections} />}</main></StoreShell> }
