import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../../src/app/database.types';

function createSupabaseClientClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default createSupabaseClientClient;
