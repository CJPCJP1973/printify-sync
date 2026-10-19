'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/checkout'

export function CheckoutButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const url = await createCheckoutSession(productId)
      window.location.assign(url)
    } catch {
      setError('Checkout is temporarily unavailable.')
      setLoading(false)
    }
  }

  return (
    <div className="checkout-wrap">
      <button className="shop-button" type="button" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Opening checkout…' : 'Buy the Field Tee'} <span aria-hidden="true">↗</span>
      </button>
      {error && <p className="checkout-error" role="alert">{error}</p>}
    </div>
  )
}
