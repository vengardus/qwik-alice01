import { type PropFunction, component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { PAGINATION } from "~/business/globals";
import type { IPagination } from "~/interfaces/global";
import type { IDataProduct } from "~/interfaces/product";
import { DetailProduct } from "./DetailProduct";


interface IProps {
  products: IDataProduct,
  // grid actions
  actionEdit$: PropFunction<(data: any) => void>,
  actionDelete$: PropFunction<(id: number) => void>,
  pagination: IPagination,
}

export const ListProduct = component$(({
  products,
  // grid actions
  actionEdit$,
  actionDelete$,
  pagination,
}: IProps) => {
  const nav = useNavigate();

  const changePage = $((action: string) => {
    if (action == PAGINATION.next)
      nav(`/products?iniRow=${pagination.iniRow + PAGINATION.limit}`)
    else {  
      // page prev
      pagination.iniRow -= PAGINATION.limit;
      pagination.iniRow = (pagination.iniRow < 0)? 0 : pagination.iniRow;
      nav(`/products?iniRow=${pagination.iniRow}`)
    }
  })


  return (
    <div>
      <h1 class='text-center'>Productos</h1>
      {
        !products.data.length
          ? <div>No se encontraron productos</div>
          :
          <>
            <div class='flex flex-col space-y-2'>
              {
                products.data.map(product => 
                  <DetailProduct 
                    key={product.id}
                    product={product}
                    actionEdit$={actionEdit$}
                    actionDelete$={actionDelete$}
                  />                  
                )
              }
            </div>

            <div class='flex pt-4 justify-start space-x-2'>
              <span>
                {((pagination.iniRow + PAGINATION.limit) > pagination.count)
                  ? pagination.count
                  : pagination.iniRow + PAGINATION.limit
                }
              </span>
              <span>de</span>
              <span>{pagination.count}</span>
            </div>
            <div class='flex py-4 justify-center space-x-5'>
              <button onClick$={() => changePage(PAGINATION.prev)}
                disabled={(pagination.iniRow <= 0) ? true : false}>
                Anteriores
              </button>
              <button onClick$={() => changePage(PAGINATION.next)}
                disabled={(pagination.iniRow + PAGINATION.limit >= pagination.count) ? true : false}>
                Siguientes
              </button>
            </div>
          </>
      }
    </div>
  )

});