import { type RequestEventBase } from "@builder.io/qwik-city";
import { createServerClient } from 'supabase-auth-helpers-qwik';
import { envs } from "~/config/envs";

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
  public static connect = (requestEvent: RequestEventBase) => {
    return createServerClient(
      envs(requestEvent).PUBLIC_SUPABASE_URL!,
      envs(requestEvent).PUBLIC_SUPABASE_ANON_KEY!,
      requestEvent
    );  
  }
}
