import { type PropFunction, component$ } from "@builder.io/qwik";
import type { IDataProduct, IProduct } from "~/interfaces/product";

interface IProps {
  products: IDataProduct,
  actionEdit$: PropFunction<(product:IProduct) => void >
  actionDelete$: PropFunction<(id:number) => void >
}


export const ListProduct = component$(({ products, actionEdit$, actionDelete$ }: IProps) => {
  return (
    <div>
      <h1 class='text-center'>Productos</h1>
      {
        !products.data.length
          ? <div>No se encontraron productos</div>
          :
          <div class='flex flex-col space-y-2'>
            {
              products.data.map(product => (
                <div key={product.id} class='flex'>
                  <div class='w-6/12'>{product.name}</div>
                  <div class='w-2/12'>{product.currency}</div>
                  <div class='w-2/12'>{product.price}</div>
                  <div class='w-1/12'><button onClick$={()=>actionEdit$(product)}>Edit</button></div>
                  <div class='w-1/12'><button onClick$={()=>actionDelete$(product.id)}>Delete</button></div>
                </div>
              ))
            }
          </div>
      }
    </div>
  )

});