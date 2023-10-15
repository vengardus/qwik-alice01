import { type RequestEventBase } from "@builder.io/qwik-city";
import { type IDataResponse } from "~/domain/dtos/app.dto";
import { Supabase } from "./supabase";

export class UserService {
    constructor(private requestEvent: RequestEventBase) {

    }

    async getByColumn(column:string, value:string): Promise<IDataResponse> {
        const supabase = Supabase.connect(this.requestEvent)

        const data = await supabase
        .from('users')
        .select("*")
        .eq(column, value)

        return {
            data: data.data,
            pagination: null,
            success: data.error ? false : true,
            message: data.error?.message ?? null
          }
    }
}