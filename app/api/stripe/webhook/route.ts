import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const signature = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return new Response('Webhook configuration missing', { status: 400 })
  }

  let event
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object
    if (session.payment_status === 'paid') {
      console.info(`[stripe] Paid checkout completed: ${session.id}`)
    }
  }

  return Response.json({ received: true })
}
