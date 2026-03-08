import { supabase } from '@/lib/supabase';
import type { Inspection } from '@/types/database';

export const inspectionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .order('scheduled_date', { ascending: false });
    if (error) throw error;
    return data as Inspection[];
  },

  async getByInspector(inspectorId: string) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('inspector_id', inspectorId)
      .order('scheduled_date', { ascending: false });
    if (error) throw error;
    return data as Inspection[];
  },

  async getScheduled() {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('status', 'scheduled')
      .order('scheduled_date', { ascending: true });
    if (error) throw error;
    return data as Inspection[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Inspection;
  },

  async create(inspection: Partial<Inspection> & { scheduled_date: string }) {
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
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Inspection;
  },

  async complete(id: string, findings: string, complianceStatus: Inspection['compliance_status'], recommendation: Inspection['recommendation']) {
    const { data, error } = await supabase
      .from('inspections')
      .update({
        status: 'completed',
        completed_date: new Date().toISOString(),
        findings,
        compliance_status: complianceStatus,
        recommendation,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Inspection;
  },
};
