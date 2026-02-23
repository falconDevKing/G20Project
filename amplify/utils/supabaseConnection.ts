import { createClient } from "@supabase/supabase-js";

const SupabaseClient = createClient(process.env.GGP_SUPABASE_URL || "", process.env.GGP_SUPABASE_ANON_KEY || "");

export default SupabaseClient;
