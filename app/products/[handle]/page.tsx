import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCart, getProduct } from '@/lib/shopify'
import { StoreShell } from '@/components/store-shell'
import { ProductDetail } from '@/components/product-detail'

export const revalidate = 60
export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) { const { handle } = await params; const product = await getProduct(handle).catch(() => null); if (!product) notFound(); const cartId = (await cookies()).get('dog-hunters-cart')?.value; const cart = cartId ? await getCart(cartId).catch(() => null) : null; return <StoreShell initialCart={cart}><main className="content-shell"><a className="back-link" href="/shop">← Back to shop</a><ProductDetail product={product} /></main></StoreShell> }
