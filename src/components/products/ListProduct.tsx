import { type PropFunction, component$ } from "@builder.io/qwik";
import type { IPagination } from "~/interfaces/general";
import type { IDataProduct } from "~/interfaces/product";
import { DetailProduct } from "./DetailProduct";
import { Pagination } from "../general/Pagination";


interface IProps {
  products: IDataProduct,
  // grid actions
  actionEdit$: PropFunction<(data: any) => void>,
  actionDelete$: PropFunction<(id: number) => void>,
  pagination: IPagination,
}

export const ListProduct = component$((props: IProps) => {

  return (
    <div>
      <h1 class='text-center'>Productos</h1>
      {
        !props.products.data.length
          ? <div>No se encontraron productos</div>
          :
          <div class='flex flex-col space-y-5'>
            <div class='flex flex-col space-y-2'>
              {
                props.products.data.map(product =>
                  <DetailProduct
                    key={product.id}
                    product={product}
                    actionEdit$={props.actionEdit$}
                    actionDelete$={props.actionDelete$}
                  />
                )
              }
            </div>

            <Pagination
              pagination={props.pagination}
              url="/products"
            />

          </div>
      }
    </div>
  )

});