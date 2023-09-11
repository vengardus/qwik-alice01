export interface IDataProduct {
  data: IProduct[],
  error: string | null
}

export interface IProduct {
  id: number,
  name: string,
  price: number,
  currency: string
}