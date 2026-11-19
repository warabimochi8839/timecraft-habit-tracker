-- 既存DB向けの移行SQL（Supabase の SQL Editor で1回だけ実行する）
-- 目的：誰でも全行を読み書きできた RLS を、「自分の行だけ」に絞る
-- 前提：Authentication の設定で「Allow anonymous sign-ins」を有効にしておく

-- 1. 行の持ち主を記録する列を追加（新しい行には自動でサインイン中のユーザーIDが入る）
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS user_id UUID
  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS user_id UUID
  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. 持ち主のいない既存の行を消す（残したい場合は、この2行を実行せずに個別に user_id を埋める）
DELETE FROM public.events WHERE user_id IS NULL;
DELETE FROM public.habits WHERE user_id IS NULL;

ALTER TABLE public.events ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.habits ALTER COLUMN user_id SET NOT NULL;

-- 3. 「全員に全操作を許可」のポリシーを削除
DROP POLICY IF EXISTS "Allow all operations for events" ON public.events;
DROP POLICY IF EXISTS "Allow all operations for habits" ON public.habits;

-- 4. サインイン済みのユーザーが、自分の行だけを操作できるポリシー
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
