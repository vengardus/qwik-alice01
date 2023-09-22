import { type IPagination } from "./general"

export interface IDataProduct {
  data: IProduct[],
  error: string | null,
  pagination: IPagination
}

export interface IProduct {
  id: number,
  name: string,
  description:string,
  price: number,
  currency: string
}