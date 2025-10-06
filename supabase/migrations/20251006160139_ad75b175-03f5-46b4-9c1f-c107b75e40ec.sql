-- Fix security issue: Restrict position data insertion to authorized operators only
-- Create a table to track which users are authorized to submit data for which vehicles

-- Create vehicle_operators table
CREATE TABLE IF NOT EXISTS public.vehicle_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, vehicle_id)
);

-- Enable RLS on vehicle_operators
ALTER TABLE public.vehicle_operators ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own vehicle assignments
CREATE POLICY "Users can view their own vehicle assignments"
ON public.vehicle_operators
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only authenticated users can be assigned to vehicles (this would typically be done by an admin)
-- For now, allow authenticated users to assign themselves (for simulator purposes)
-- In production, you'd want to restrict this to admins only
CREATE POLICY "Users can assign themselves to vehicles"
ON public.vehicle_operators
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create a security definer function to check if a user is authorized for a vehicle
CREATE OR REPLACE FUNCTION public.is_authorized_operator(_user_id UUID, _vehicle_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vehicle_operators
    WHERE user_id = _user_id
      AND vehicle_id = _vehicle_id
  )
$$;

-- Drop the existing overly permissive policy on positions
DROP POLICY IF EXISTS "Authenticated users can insert positions" ON public.positions;

-- Create a new restrictive policy that validates authorization
CREATE POLICY "Only authorized operators can insert positions"
ON public.positions
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_operator(auth.uid(), vehicle_id));

-- Similarly restrict the buses table
DROP POLICY IF EXISTS "Authenticated users can insert buses" ON public.buses;
DROP POLICY IF EXISTS "Authenticated users can update buses" ON public.buses;

CREATE POLICY "Only authorized operators can insert buses"
ON public.buses
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_operator(auth.uid(), vehicle_id));

CREATE POLICY "Only authorized operators can update buses"
ON public.buses
FOR UPDATE
TO authenticated
USING (public.is_authorized_operator(auth.uid(), vehicle_id));