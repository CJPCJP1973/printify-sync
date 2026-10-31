import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/server'
import ProductDesignForm from './design-form'

export default async function ProductDesignPage() {
  const user = await requireAdmin()
  if (!user) redirect('/admin/login')

  return <ProductDesignForm />
}
