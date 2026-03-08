import { supabase } from '@/lib/supabase';
import type { Certificate } from '@/types/database';

export const permitService = {
  async getAll() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issued_date', { ascending: false });
    if (error) throw error;
    return data as Certificate[];
  },

  async getByEstablishment(establishmentId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('issued_date', { ascending: false });
    if (error) throw error;
    return data as Certificate[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Certificate;
  },

  async create(certificate: Partial<Certificate> & { type: string; issued_date: string; certificate_number: string }) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();
    if (error) throw error;
    return data as Certificate;
  },

  async revoke(id: string) {
    const { data, error } = await supabase
      .from('certificates')
      .update({ status: 'revoked' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Certificate;
  },
};
