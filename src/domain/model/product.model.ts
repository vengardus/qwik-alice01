import { type IProductEntity } from "../entity/product.entity"
import type { IRegisterProductDto } from "../dtos/product.dto"



export class Product {


  constructor(
    private aTOProduct: IProductEntity[] = []
  ) { }

  count() {
    return this.aTOProduct.length
  }

  getATOPoduct() {
    return this.aTOProduct
  }

  setATOProduct(data: IProductEntity[]) {
    this.aTOProduct = data
  }

  static validateObject(object: { [key: string]: any }): [string?, IRegisterProductDto?] {
    const { name, description, price, currency } = object
    if (!name) return ['Ingrese nombre']
    if (!description) return ['Ingrese descripción']
    if (!price) return ['Ingrese precio']
    if (!currency) return ['Ingrese currency']
    const priceToNumber = Number(price);
    if (Number.isNaN(priceToNumber) || priceToNumber <= 0) return ['Error en precio']

    return [undefined, {
      name: String(name).toUpperCase(),
      description: String(description).toUpperCase(),
      price: Number(price),
      currency: String(currency).toUpperCase()
    }]
  }


}