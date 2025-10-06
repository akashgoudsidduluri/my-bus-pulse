-- Complete the security fix by updating the RLS policies
-- The vehicle_operators table and is_authorized_operator function already exist

-- Drop and recreate policies on positions table
DROP POLICY IF EXISTS "Authenticated users can insert positions" ON public.positions;
DROP POLICY IF EXISTS "Only authorized operators can insert positions" ON public.positions;

CREATE POLICY "Only authorized operators can insert positions"
ON public.positions
FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_operator(auth.uid(), vehicle_id));

-- Drop and recreate policies on buses table
DROP POLICY IF EXISTS "Authenticated users can insert buses" ON public.buses;
DROP POLICY IF EXISTS "Authenticated users can update buses" ON public.buses;
DROP POLICY IF EXISTS "Only authorized operators can insert buses" ON public.buses;
DROP POLICY IF EXISTS "Only authorized operators can update buses" ON public.buses;

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