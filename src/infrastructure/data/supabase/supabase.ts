import { type RequestEventBase } from "@builder.io/qwik-city";
import { createServerClient } from 'supabase-auth-helpers-qwik';

export interface ISupabaseResponse {
  error: {
    code: string,
    details: any,
    hint: any,
    message: string
  } | null,
  data: any[] | null,
  count: any | null,
  status: number,
  statusText: string
}


export class Supabase {
  public static connect = (requestEv: RequestEventBase) => {
    return createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv
    );
  }
}
