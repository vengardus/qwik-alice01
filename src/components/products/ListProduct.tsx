import { type PropFunction, component$, type Signal } from "@builder.io/qwik";
import type { IPagination } from "~/interfaces/general";
import type { IProduct } from "~/interfaces/product";
import { DetailProduct } from "./DetailProduct";
import { Pagination } from "../general/Pagination";


interface IProps {
  products: IProduct[],
  // grid actions
  actionEdit$: PropFunction<(data: any) => void>,
  actionDelete$: PropFunction<(id: number) => void>,
  pagination: IPagination,
}

export const ListProduct = component$((props: IProps) => {
  console.log('ListProduct-Pagination', props.products)
  return (
    <div>
      <h1 class='text-center'>Productos</h1>
      <div>Pagination: 
        {props.pagination.iniRow} /
        {props.pagination.count}
      </div>
      {
        !props.products.length
          ? <div>No se encontraron productos</div>
          :
          <div class='flex flex-col space-y-5'>
            <div class='flex flex-col space-y-2'>
              {
                props.products.map((product : IProduct) =>
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