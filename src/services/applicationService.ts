import { supabase } from '@/lib/supabase';
import type { Application } from '@/types/database';

export const applicationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getByApplicant(applicantId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getByStatus(status: Application['status']) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Application;
  },

  async create(application: Partial<Application> & { applicant_id: string; type: Application['type'] }) {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();
    if (error) throw error;
    return data as Application;
  },

  async update(id: string, updates: Partial<Application>) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Application;
  },

  async getStats() {
    const { data, error } = await supabase
      .from('applications')
      .select('status, type');
    if (error) throw error;
    return data as Pick<Application, 'status' | 'type'>[];
  },
};
