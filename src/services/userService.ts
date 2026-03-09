import { supabase } from '@/integrations/supabase/client';
import type { DbUser } from '@/types/database';

export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as DbUser[];
  },

  async getById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data as DbUser;
  },

  async getByRole(userType: DbUser['user_type']) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', userType)
      .order('full_name', { ascending: true });
    if (error) throw error;
    return data as DbUser[];
  },

  async update(userId: string, updates: Partial<DbUser>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as DbUser;
  },
};
