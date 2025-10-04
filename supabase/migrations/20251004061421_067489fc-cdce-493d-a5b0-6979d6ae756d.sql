-- Create buses table (stores last known position for each bus)
CREATE TABLE IF NOT EXISTS public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT UNIQUE NOT NULL,
  route_id TEXT,
  last_lat DOUBLE PRECISION,
  last_lon DOUBLE PRECISION,
  last_update TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create positions table (stores historical position data)
CREATE TABLE IF NOT EXISTS public.positions (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES public.buses(vehicle_id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  speed REAL,
  heading INTEGER,
  ts TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient position queries
CREATE INDEX IF NOT EXISTS idx_positions_vehicle_ts ON public.positions(vehicle_id, ts DESC);

-- Enable Row Level Security
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access for buses
CREATE POLICY "Public can view buses" 
ON public.buses 
FOR SELECT 
TO anon, authenticated
USING (true);

-- RLS Policies: Allow public read access for positions
CREATE POLICY "Public can view positions" 
ON public.positions 
FOR SELECT 
TO anon, authenticated
USING (true);

-- RLS Policies: Allow authenticated users to insert positions (for simulator/devices)
CREATE POLICY "Authenticated users can insert positions" 
ON public.positions 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- RLS Policies: Allow authenticated users to insert/update buses
CREATE POLICY "Authenticated users can insert buses" 
ON public.buses 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update buses" 
ON public.buses 
FOR UPDATE 
TO authenticated
USING (true);

-- Create trigger function to update buses table when new position is inserted
CREATE OR REPLACE FUNCTION public.update_bus_last_position()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the bus record with the latest position
  INSERT INTO public.buses (vehicle_id, route_id, last_lat, last_lon, last_update)
  VALUES (NEW.vehicle_id, NULL, NEW.lat, NEW.lon, NEW.ts)
  ON CONFLICT (vehicle_id) 
  DO UPDATE SET
    last_lat = NEW.lat,
    last_lon = NEW.lon,
    last_update = NEW.ts;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update buses table
DROP TRIGGER IF EXISTS trg_update_bus_last_position ON public.positions;
CREATE TRIGGER trg_update_bus_last_position
AFTER INSERT ON public.positions
FOR EACH ROW
EXECUTE FUNCTION public.update_bus_last_position();

-- Enable realtime for buses table
ALTER PUBLICATION supabase_realtime ADD TABLE public.buses;

-- Set replica identity for realtime updates
ALTER TABLE public.buses REPLICA IDENTITY FULL;