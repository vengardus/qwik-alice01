export interface ISupabase {
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


