import { type IProduct } from "~/interfaces/product";

export const validateProduct = (props: any) => {
  let success = true;
  let message = '';
  const priceToNumber = Number(props.price);
  
  if (Number.isNaN(priceToNumber) || priceToNumber <= 0) {
    success = false;
    message = 'Error en precio.';
  }
  const data:IProduct = {
    id: 0,
    name: String(props.name).toUpperCase(),
    description : String(props.name).toUpperCase(),
    price: priceToNumber,
    currency: String(props.currency).toUpperCase()
  }

  return {
    success: success,
    message: message,
    data: data
  }

}