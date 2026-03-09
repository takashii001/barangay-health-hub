import { supabase } from '@/lib/supabase';
import type { Certificate } from '@/types/database';

export const permitService = {
  async getAll() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data as Certificate[];
  },

  async getByApplication(applicationId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('application_id', applicationId)
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data as Certificate[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_id', id)
      .single();
    if (error) throw error;
    return data as Certificate;
  },

  async create(certificate: Partial<Certificate> & { certificate_no: string; issue_date: string }) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();
    if (error) throw error;
    return data as Certificate;
  },
};
