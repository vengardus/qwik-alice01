import { type RequestEventBase } from "@builder.io/qwik-city"

export const envs = (requestEvent: RequestEventBase) => {
    return {
        JWT_PRIVATE_KEY: requestEvent.env.get('JWT_PRIVATE_KEY'),
        PUBLIC_SUPABASE_URL: requestEvent.env.get("PUBLIC_SUPABASE_URL")!,
        PUBLIC_SUPABASE_ANON_KEY: requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    }

}