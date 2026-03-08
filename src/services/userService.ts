import { supabase } from '@/lib/supabase';
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

  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as DbUser;
  },

  async getByRole(role: DbUser['role']) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('full_name', { ascending: true });
    if (error) throw error;
    return data as DbUser[];
  },

  async update(id: string, updates: Partial<DbUser>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DbUser;
  },
};
