import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IDataResponse } from "~/domain/dtos/app.dto";
import { Supabase } from "./supabase";

export class AuthService {
    constructor(private requestEvent: RequestEventBase) {

    }

    async login(dataAuth: {
        username: string,
        password: string
    }): Promise<IDataResponse> {
        const { username, password } = dataAuth
        console.log(dataAuth)
        const supabase = Supabase.connect(this.requestEvent)

        // const data0 = await supabase
        // .from('users')
        // .select("*")
        // console.log('service-getAll', data0)

        const data = await supabase
        .from('users')
        .select("*")
        .eq('username', username)
        .eq('password', password)
        console.log('service', data)
        return {
            data: data.data,
            pagination: null,
            success: data.error ? false : true,
            message: data.error?.message ?? null
          }
    }
}