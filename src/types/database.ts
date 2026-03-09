export type UserRole =
  | 'citizen'
  | 'business_owner'
  | 'health_worker'
  | 'inspector'
  | 'admin';

export interface DbUser {
  user_id: string;
  full_name: string;
  email: string;
  contact_no?: string | null;
  address?: string | null;
  user_type: UserRole;
  account_status: string;
  created_at: string;
}

export interface Establishment {
  establishment_id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  address: string;
  permit_status?: string | null;
  created_at: string;
}

export interface Application {
  application_id: string;
  user_id: string;
  establishment_id?: string | null;
  application_type: string;
  date_submitted: string;
  status: string;
}

export interface Inspector {
  inspector_id: string;
  name: string;
  department?: string | null;
  position?: string | null;
  status: string;
}

export interface Inspection {
  inspection_id: string;
  application_id?: string | null;
  inspector_id?: string | null;
  inspection_date: string;
  findings?: string | null;
  compliance_status?: string | null;
}

export interface Certificate {
  certificate_id: string;
  application_id?: string | null;
  certificate_no: string;
  issue_date: string;
  expiry_date?: string | null;
  qr_code?: string | null;
}

export interface Payment {
  payment_id: string;
  application_id?: string | null;
  amount: number;
  payment_method?: string | null;
  receipt_no?: string | null;
  created_at: string;
}

export interface LabResult {
  lab_id: string;
  application_id?: string | null;
  test_type: string;
  result: string;
  date_uploaded: string;
}
