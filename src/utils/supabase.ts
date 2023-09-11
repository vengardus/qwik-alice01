import { type RequestEventBase } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from 'supabase-auth-helpers-qwik';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonPublic = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonPublic, {
  auth: {
    persistSession: false
  }}
  )

export const supabaseClient = (requestEv:RequestEventBase) => {
  return createServerClient(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv
  );
}

// export const supabaseClientLoader = (requestEv:RequestEventLoader) => {
//   console.log('0.supabaseClientLoader', requestEv)
//   console.log('1.routeLoader', requestEv.env.get("PUBLIC_SUPABASE_URL"))
//   return createServerClient(
//     requestEv.env.get("PUBLIC_SUPABASE_URL")!,
//     requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
//     requestEv
//   );
// }

