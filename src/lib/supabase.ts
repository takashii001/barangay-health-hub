import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mjpdlobgchchrehsjwda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcGRsb2JnY2hjaHJlaHNqd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTk4MzYsImV4cCI6MjA4ODU3NTgzNn0._UwU7aS6zHHm_gKi7VxLfahDT9pAoF9naMKHNl4zFXI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
