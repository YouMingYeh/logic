'use server';

import { redirect } from 'next/navigation';
import createSupabaseServerClient from '../../../lib/supabase/server';

export async function updateUser(values: { phone?: string; email?: string }) {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.updateUser(values);
}

export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase.auth.getUser();

    return data.user;
  } catch (error) {
    return null;
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect('/auth/login');
}
