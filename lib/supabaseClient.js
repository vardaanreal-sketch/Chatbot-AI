import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY,
)

export default supabase
