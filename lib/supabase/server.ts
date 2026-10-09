import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot always mutate cookies; the proxy refreshes sessions.
          }
        },
      },
    },
  )
}

export const ADMIN_EMAIL = '941cjp941@gmail.com'

export function isAdminEmail(email?: string | null) {
  return email?.toLowerCase() === ADMIN_EMAIL
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) return null
  return user
}

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getSupabaseClient() {
  return createClient()
}

export async function getAdminState() {
  const user = await requireUser()
  return { user, isAdmin: isAdminEmail(user?.email) }
}

export async function getAdminOnly() {
  const user = await requireAdmin()
  return user
}
