import { supabase } from '@/lib/supabase';
import type { Application } from '@/types/database';

export const applicationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('date_submitted', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getByApplicant(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('date_submitted', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', status)
      .order('date_submitted', { ascending: false });
    if (error) throw error;
    return data as Application[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', id)
      .single();
    if (error) throw error;
    return data as Application;
  },

  async create(application: Partial<Application> & { user_id: string; application_type: string }) {
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
      .eq('application_id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Application;
  },

  async getStats() {
    const { data, error } = await supabase
      .from('applications')
      .select('status, application_type');
    if (error) throw error;
    return data;
  },
};
