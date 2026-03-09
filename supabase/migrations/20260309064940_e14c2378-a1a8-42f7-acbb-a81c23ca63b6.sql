
-- Create user_type enum
CREATE TYPE public.user_type_enum AS ENUM ('citizen', 'business_owner', 'health_worker', 'inspector', 'admin');

-- Users table
CREATE TABLE public.users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contact_no TEXT,
  address TEXT,
  user_type public.user_type_enum NOT NULL DEFAULT 'citizen',
  account_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Establishments table
CREATE TABLE public.establishments (
  establishment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  address TEXT NOT NULL,
  permit_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own establishments" ON public.establishments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own establishments" ON public.establishments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own establishments" ON public.establishments FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Applications table
CREATE TABLE public.applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  establishment_id UUID REFERENCES public.establishments(establishment_id) ON DELETE SET NULL,
  application_type TEXT NOT NULL,
  date_submitted TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own applications" ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own applications" ON public.applications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Inspectors table
CREATE TABLE public.inspectors (
  inspector_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

ALTER TABLE public.inspectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read inspectors" ON public.inspectors FOR SELECT TO authenticated USING (true);

-- Inspections table
CREATE TABLE public.inspections (
  inspection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(application_id) ON DELETE SET NULL,
  inspector_id UUID REFERENCES public.inspectors(inspector_id) ON DELETE SET NULL,
  inspection_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  findings TEXT,
  compliance_status TEXT
);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read inspections" ON public.inspections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert inspections" ON public.inspections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update inspections" ON public.inspections FOR UPDATE TO authenticated USING (true);

-- Certificates table
CREATE TABLE public.certificates (
  certificate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(application_id) ON DELETE SET NULL,
  certificate_no TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  qr_code TEXT
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read certificates" ON public.certificates FOR SELECT TO authenticated USING (true);

-- Payments table
CREATE TABLE public.payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(application_id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT,
  receipt_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read payments" ON public.payments FOR SELECT TO authenticated USING (true);

-- Lab Results table
CREATE TABLE public.lab_results (
  lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(application_id) ON DELETE SET NULL,
  test_type TEXT NOT NULL,
  result TEXT NOT NULL,
  date_uploaded TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read lab results" ON public.lab_results FOR SELECT TO authenticated USING (true);

-- Admin policies using security definer function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE user_id = _user_id AND user_type = 'admin'
  )
$$;

CREATE POLICY "Admins can read all users" ON public.users FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read all establishments" ON public.establishments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read all applications" ON public.applications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert inspections" ON public.inspections FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (user_id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type_enum, 'citizen')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
