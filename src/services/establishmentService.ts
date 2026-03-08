import { supabase } from '@/lib/supabase';
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

  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Establishment[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Establishment;
  },

  async create(establishment: Partial<Establishment> & { owner_id: string; name: string; type: string; address: string }) {
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
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Establishment;
  },
};
