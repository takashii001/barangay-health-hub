
-- Create inspector role check function
CREATE OR REPLACE FUNCTION public.is_inspector_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE user_id = _user_id AND user_type IN ('inspector', 'admin')
  )
$$;

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated can insert inspections" ON public.inspections;
DROP POLICY IF EXISTS "Authenticated can update inspections" ON public.inspections;
DROP POLICY IF EXISTS "Admins can insert inspections" ON public.inspections;

-- Replace with role-checked policies
CREATE POLICY "Inspectors/admins can insert inspections" ON public.inspections FOR INSERT TO authenticated WITH CHECK (public.is_inspector_or_admin(auth.uid()));
CREATE POLICY "Inspectors/admins can update inspections" ON public.inspections FOR UPDATE TO authenticated USING (public.is_inspector_or_admin(auth.uid()));
