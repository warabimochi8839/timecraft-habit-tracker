import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 端末ごとに匿名ユーザーとしてサインインする。
// RLS は auth.uid() で行の持ち主を判定するので、DB を触る前に必ずこれを待つ。
export const sessionReady: Promise<void> = (async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) return
    const { error } = await supabase.auth.signInAnonymously()
    if (error) console.error('Anonymous sign-in failed', error)
})()
