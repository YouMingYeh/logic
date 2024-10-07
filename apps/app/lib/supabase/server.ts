'use server';

import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../../src/app/database.types';

async function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // ignore
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, ...options });
          } catch (error) {
            // ignore
          }
        },
      },
    },
  );
}

export default createSupabaseServerClient;
