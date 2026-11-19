-- 各行に持ち主（user_id）を持たせ、RLS で自分の行だけ操作できるようにする。
-- 利用者は端末ごとの匿名サインイン（Authentication で Allow anonymous sign-ins を有効化）。

CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  date TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_time_minutes INTEGER NOT NULL,
  completed_dates JSONB DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: 'currentStreak' is calculated on the client side, so we don't need a DB column for it.

-- Row Level Security：サインイン済みのユーザーが自分の行だけを操作できる
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own rows only" ON public.events
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Own rows only" ON public.habits
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events (user_id);
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits (user_id);

-- Enable realtime broadcasts for both tables
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.habits;
