import { supabase } from '@/lib/supabase';
import type { Inspection } from '@/types/database';

export const inspectionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .order('inspection_date', { ascending: false });
    if (error) throw error;
    return data as Inspection[];
  },

  async getByInspector(inspectorId: string) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('inspector_id', inspectorId)
      .order('inspection_date', { ascending: false });
    if (error) throw error;
    return data as Inspection[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('inspection_id', id)
      .single();
    if (error) throw error;
    return data as Inspection;
  },

  async create(inspection: Partial<Inspection> & { inspection_date: string }) {
    const { data, error } = await supabase
      .from('inspections')
      .insert(inspection)
      .select()
      .single();
    if (error) throw error;
    return data as Inspection;
  },

  async update(id: string, updates: Partial<Inspection>) {
    const { data, error } = await supabase
      .from('inspections')
      .update(updates)
      .eq('inspection_id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Inspection;
  },
};
