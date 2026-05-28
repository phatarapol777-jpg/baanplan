import { createClient } from "@supabase/supabase-js"

/** Admin client ใช้ service_role key — bypass RLS ทั้งหมด */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder",
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
)
