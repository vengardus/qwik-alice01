export interface IDataResponse {
  data:any[] | any | null,
  pagination: {
    offset: number
    count: number
  } | null,
  success: boolean,
  message: string | null
} 