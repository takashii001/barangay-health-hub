export type UserRole =
  | 'citizen'
  | 'business_owner'
  | 'bhw'
  | 'sanitation_inspector'
  | 'nurse'
  | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: 'Citizen',
  business_owner: 'Business Owner',
  bhw: 'Barangay Health Worker',
  sanitation_inspector: 'Sanitation Inspector',
  nurse: 'Nurse / Health Worker',
  admin: 'City Health Officer / LGU Admin',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  citizen: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  business_owner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  bhw: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  sanitation_inspector: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  nurse: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};
