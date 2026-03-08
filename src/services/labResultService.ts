import { supabase } from '@/lib/supabase';
import type { LabResult } from '@/types/database';

export const labResultService = {
  async getAll() {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .order('date_conducted', { ascending: false });
    if (error) throw error;
    return data as LabResult[];
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('lab_results')
      .select('*')
      .eq('patient_id', patientId)
      .order('date_conducted', { ascending: false });
    if (error) throw error;
    return data as LabResult[];
  },

  async create(result: Partial<LabResult> & { test_type: string; result: string; date_conducted: string }) {
    const { data, error } = await supabase
      .from('lab_results')
      .insert(result)
      .select()
      .single();
    if (error) throw error;
    return data as LabResult;
  },
};
