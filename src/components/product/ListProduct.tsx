import { type PropFunction, component$ } from "@builder.io/qwik";
import { type IProductEntity } from "~/domain/entity/product.entity";
import { ItemProduct } from "./ItemProduct";
import { ListViewFooter } from "../shared/listview/ListViewFooter";
import { ListViewHeader } from "../shared/listview/ListViewHeader";
import { ListViewDatatHeader } from "../shared/listview/ListViewDataHeader";


export interface ListProdProps {
    products: IProductEntity[] | null,
    editAction$: PropFunction<(data: any) => void>,
    deleteAction$: PropFunction<(id: number) => void>,
    paginationAction$: PropFunction<(typeAction: string) => void>,
    paginationStore: {
        offset: number,
        count: number
    },
    msgLoading: string,
    showModalCallback$: PropFunction<() => void>
}

export const ListProduct = component$<ListProdProps>(({
    products,
    editAction$,
    deleteAction$,
    paginationAction$,
    paginationStore,
    msgLoading,
    showModalCallback$
}) => {
    return (
        <div class="flex flex-col space-y-3 w-full">
            <ListViewHeader
                title="Productos"
                showModalCallback$={showModalCallback$}
            />

            <ListViewDatatHeader>
                <div class='w-1/12'>Id</div>
                <div class='w-3/12'>Name</div>
                <div class='w-3/12'>Descripción</div>
                <div class='w-2/12'>Precio</div>
                <div class='w-1/12'>Moneda</div>
                <div class='w-1/12'>.</div>
                <div class='w-1/12'>.</div>
            </ListViewDatatHeader>

            {/* ListViewData */}
            <div class="flex flex-col space-y-2"> {
                products?.map(product => (
                    <ItemProduct
                        key={product.id}
                        product={product}
                        editAction$={editAction$}
                        deleteAction$={deleteAction$}
                    />
                ))
            } </div>

            <ListViewFooter
                paginationAction$={(typeAction: string) => paginationAction$(typeAction)}
                paginationStore={{ offset: paginationStore.offset, count: paginationStore.count }}
            />

            <div>{msgLoading}</div>
        </div>
    )
})
