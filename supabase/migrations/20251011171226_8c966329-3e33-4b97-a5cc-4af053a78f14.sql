-- Enable Realtime for positions table
ALTER TABLE public.positions REPLICA IDENTITY FULL;

-- Add positions table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;