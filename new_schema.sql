-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action USER-DEFINED NOT NULL,
  description text,
  old_values jsonb,
  new_values jsonb,
  performed_by uuid,
  performed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_log_pkey PRIMARY KEY (id),
  CONSTRAINT activity_log_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT '📦'::text,
  color text DEFAULT '#6B7280'::text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.equipment (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  serial_number text NOT NULL UNIQUE,
  description text,
  category_id uuid,
  department text NOT NULL,
  location text NOT NULL,
  status USER-DEFINED DEFAULT 'active'::equipment_status,
  maintenance_team_id uuid NOT NULL,
  default_technician_id uuid,
  purchase_date date NOT NULL,
  warranty_expiry date,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  work_center_id uuid,
  company_name text DEFAULT 'My Company (San Francisco)'::text,
  used_by_employee_name text,
  scrap_date date,
  CONSTRAINT equipment_pkey PRIMARY KEY (id),
  CONSTRAINT equipment_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES public.work_centers(id),
  CONSTRAINT equipment_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT equipment_maintenance_team_id_fkey FOREIGN KEY (maintenance_team_id) REFERENCES public.maintenance_teams(id),
  CONSTRAINT equipment_default_technician_id_fkey FOREIGN KEY (default_technician_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.maintenance_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  request_number text UNIQUE,
  subject text NOT NULL,
  description text,
  resolution_notes text,
  request_type USER-DEFINED DEFAULT 'corrective'::request_type,
  priority USER-DEFINED DEFAULT 'medium'::request_priority,
  stage USER-DEFINED DEFAULT 'new'::request_stage,
  equipment_id uuid NOT NULL,
  category_id uuid,
  maintenance_team_id uuid,
  assigned_technician_id uuid,
  created_by uuid NOT NULL,
  scheduled_date date,
  due_date date,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  duration_hours numeric DEFAULT 
CASE
    WHEN ((started_at IS NOT NULL) AND (completed_at IS NOT NULL)) THEN (EXTRACT(epoch FROM (completed_at - started_at)) / (3600)::numeric)
    ELSE NULL::numeric
END,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  target_type text DEFAULT 'equipment'::text,
  work_center_id uuid,
  CONSTRAINT maintenance_requests_pkey PRIMARY KEY (id),
  CONSTRAINT maintenance_requests_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id),
  CONSTRAINT maintenance_requests_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT maintenance_requests_maintenance_team_id_fkey FOREIGN KEY (maintenance_team_id) REFERENCES public.maintenance_teams(id),
  CONSTRAINT maintenance_requests_assigned_technician_id_fkey FOREIGN KEY (assigned_technician_id) REFERENCES public.profiles(id),
  CONSTRAINT maintenance_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT maintenance_requests_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES public.work_centers(id)
);
CREATE TABLE public.maintenance_teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT maintenance_teams_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info'::text,
  is_read boolean DEFAULT false,
  related_request_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT notifications_related_request_id_fkey FOREIGN KEY (related_request_id) REFERENCES public.maintenance_requests(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role USER-DEFINED DEFAULT 'technician'::user_role,
  department text,
  phone text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role USER-DEFINED DEFAULT 'technician'::team_role,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT team_members_pkey PRIMARY KEY (id),
  CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.maintenance_teams(id),
  CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.work_centers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text,
  tag text,
  cost_per_hour numeric DEFAULT 0.00,
  capacity_efficiency numeric DEFAULT 100.00,
  oee_target numeric DEFAULT 80.00,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT work_centers_pkey PRIMARY KEY (id)
);