export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'field-tee',
    name: 'Field Tee',
    description: 'A heavyweight tee for long days in the field.',
    priceInCents: 3200,
  },
]
