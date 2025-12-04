export type UserRole = 
  | 'resident' 
  | 'bhw' 
  | 'bsi' 
  | 'clerk' 
  | 'captain' 
  | 'sysadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  resident: 'Resident',
  bhw: 'Barangay Health Worker',
  bsi: 'Sanitary Inspector',
  clerk: 'Barangay Clerk',
  captain: 'Barangay Captain',
  sysadmin: 'System Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  resident: 'bg-blue-100 text-blue-800',
  bhw: 'bg-green-100 text-green-800',
  bsi: 'bg-amber-100 text-amber-800',
  clerk: 'bg-purple-100 text-purple-800',
  captain: 'bg-red-100 text-red-800',
  sysadmin: 'bg-gray-100 text-gray-800',
};
