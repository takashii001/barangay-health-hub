import { supabase } from '@/integrations/supabase/client';
import type { LabResult } from '@/types/database';

export const labResultService = {
  async getAll() {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .order('date_uploaded', { ascending: false });
    if (error) throw error;
    return data as LabResult[];
  },

  async getByApplication(applicationId: string) {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('application_id', applicationId)
      .order('date_uploaded', { ascending: false });
    if (error) throw error;
    return data as LabResult[];
  },

  async create(result: Partial<LabResult> & { test_type: string; result: string; date_uploaded: string }) {
    const { data, error } = await supabase
      .from('lab_results')
      .insert(result)
      .select()
      .single();
    if (error) throw error;
    return data as LabResult;
  },
};
