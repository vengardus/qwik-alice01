import { type PropFunction, component$ } from "@builder.io/qwik";
import { type IProduct } from "~/interfaces/product";

interface IProps {
  product: IProduct,
  // gird actions
  actionEdit$: PropFunction<(data: any) => void>,
  actionDelete$: PropFunction<(id: number) => void>,
}

export const DetailProduct = component$(({
  product,
  actionEdit$,
  actionDelete$
}: IProps) => {
  return (
    <div class='flex'>
      <div class='w-6/12'>{product.name}</div>
      <div class='w-2/12'>{product.currency}</div>
      <div class='w-2/12'>{product.price}</div>
      <div class='w-1/12'><button onClick$={() => actionEdit$(product)}>Edit</button></div>
      <div class='w-1/12'><button onClick$={() => actionDelete$(product.id)}>Delete</button></div>
    </div>
  )
});