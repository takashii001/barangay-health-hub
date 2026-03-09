import { supabase } from '@/integrations/supabase/client';
import type { Establishment } from '@/types/database';

export const establishmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Establishment[];
  },

  async getByOwner(userId: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Establishment[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('establishment_id', id)
      .single();
    if (error) throw error;
    return data as Establishment;
  },

  async create(establishment: Partial<Establishment> & { user_id: string; business_name: string; business_type: string; address: string }) {
    const { data, error } = await supabase
      .from('establishments')
      .insert(establishment)
      .select()
      .single();
    if (error) throw error;
    return data as Establishment;
  },

  async update(id: string, updates: Partial<Establishment>) {
    const { data, error } = await supabase
      .from('establishments')
      .update(updates)
      .eq('establishment_id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Establishment;
  },
};
