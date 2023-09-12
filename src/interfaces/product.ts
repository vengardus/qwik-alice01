export interface IDataProduct {
  data: IProduct[],
  error: string | null,
  pagination: {
    count: number,
    iniRow: number
  }
}

export interface IProduct {
  id: number,
  name: string,
  price: number,
  currency: string
}