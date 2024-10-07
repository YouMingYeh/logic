'use server';
import createSupabaseServerClient from '../../../lib/supabase/server';
import { Database, Tables } from '../../app/database.types';

type Profile = Tables<'profile'>;
type ProfileCreate = Database['public']['Tables']['profile']['Insert'];

export const createProfile = async (profile: ProfileCreate) => {
  const supabase = await createSupabaseServerClient();

  return supabase.from('profile').insert(profile).select('*').single();
};

export const readProfile = async (userId: string) => {
  const supabase = await createSupabaseServerClient();

  return supabase.from('profile').select('*').eq('user_id', userId).single();
}
