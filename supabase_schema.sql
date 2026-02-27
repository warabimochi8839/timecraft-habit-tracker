-- We are creating a simple "anonymous" schema for MVP sync. 
-- In a real production app with Auth, we would use UUIDs mapping to auth.users(), 
-- but here we assume a single user or locally generated mock user_id for simplicity (if we were sharing the DB).
-- To keep it truly simple for the current state where anyone using this uses the SAME database,
-- or assumes it's a personal database for 1 user, we just create the tables.

CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  date TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_time_minutes INTEGER NOT NULL,
  completed_dates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: 'currentStreak' is calculated on the client side, so we don't need a DB column for it.

-- Enable Row Level Security (RLS) but set it to allow all for this MVP without Auth
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for events" ON public.events
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for habits" ON public.habits
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

-- Enable realtime broadcasts for both tables
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.habits;
