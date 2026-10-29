'use server'

import { PRODUCTS } from '@/lib/products'
import { getStripe } from '@/lib/stripe'

function getCanonicalSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (
    process.env.NODE_ENV === 'production'
      ? 'https://printify-sync.vercel.app'
      : 'http://localhost:3000'
  )

  let url: URL
  try {
    url = new URL(configuredUrl)
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute URL')
  }

  if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS in production')
  }

  return url.origin
}

export async function createCheckoutSession(productId: string) {
  const product = PRODUCTS.find((item) => item.id === productId)
  if (!product) throw new Error('Product not found')

  const origin = getCanonicalSiteOrigin()
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: product.name, description: product.description },
        unit_amount: product.priceInCents,
      },
      quantity: 1,
    }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    integration_identifier: `dog-hunters-${crypto.randomUUID()}`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}
