export type UserRole =
  | 'citizen'
  | 'business_owner'
  | 'bhw'
  | 'sanitation_inspector'
  | 'nurse'
  | 'admin';

export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Establishment {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  address: string;
  contact_number?: string | null;
  documents?: string[] | null;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  establishment_id?: string | null;
  type: 'sanitation_permit' | 'health_service' | 'complaint' | 'vaccination';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  description?: string | null;
  documents?: string[] | null;
  notes?: string | null;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inspector {
  id: string;
  user_id: string;
  license_number?: string | null;
  specialization?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Inspection {
  id: string;
  application_id?: string | null;
  establishment_id?: string | null;
  inspector_id?: string | null;
  scheduled_date: string;
  completed_date?: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  findings?: string | null;
  compliance_status?: 'compliant' | 'non_compliant' | 'partial' | null;
  correction_notice?: string | null;
  recommendation?: 'approve' | 'reject' | 'reinspect' | null;
  photos?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  application_id?: string | null;
  establishment_id?: string | null;
  type: string;
  issued_date: string;
  expiry_date?: string | null;
  certificate_number: string;
  issued_by?: string | null;
  status: 'active' | 'expired' | 'revoked';
  created_at: string;
}

export interface Payment {
  id: string;
  application_id?: string | null;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string | null;
  reference_number?: string | null;
  paid_at?: string | null;
  created_at: string;
}

export interface LabResult {
  id: string;
  patient_id?: string | null;
  test_type: string;
  result: string;
  date_conducted: string;
  conducted_by?: string | null;
  notes?: string | null;
  created_at: string;
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Partial<DbUser> & { email: string; full_name: string; role: UserRole };
        Update: Partial<DbUser>;
      };
      establishments: {
        Row: Establishment;
        Insert: Partial<Establishment> & { owner_id: string; name: string; type: string; address: string };
        Update: Partial<Establishment>;
      };
      applications: {
        Row: Application;
        Insert: Partial<Application> & { applicant_id: string; type: Application['type'] };
        Update: Partial<Application>;
      };
      inspectors: {
        Row: Inspector;
        Insert: Partial<Inspector> & { user_id: string };
        Update: Partial<Inspector>;
      };
      inspections: {
        Row: Inspection;
        Insert: Partial<Inspection> & { scheduled_date: string };
        Update: Partial<Inspection>;
      };
      certificates: {
        Row: Certificate;
        Insert: Partial<Certificate> & { type: string; issued_date: string; certificate_number: string };
        Update: Partial<Certificate>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> & { amount: number };
        Update: Partial<Payment>;
      };
      lab_results: {
        Row: LabResult;
        Insert: Partial<LabResult> & { test_type: string; result: string; date_conducted: string };
        Update: Partial<LabResult>;
      };
    };
  };
}
