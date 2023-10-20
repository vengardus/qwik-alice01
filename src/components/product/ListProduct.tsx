import { type PropFunction, component$ } from "@builder.io/qwik";
import { ItemProduct } from "./ItemProduct";
import { ListViewFooter } from "../shared/listview/ListViewFooter";
import { ListViewHeader } from "../shared/listview/ListViewHeader";
import { ListViewDatatHeader } from "../shared/listview/ListViewDataHeader";
import { type IListProductDto } from "~/domain/dtos/product.dto";
import { type IProductEntity } from "~/domain/entity/product.entity";
import { ProductModel } from "~/data/supabase/models/product.model";


export interface ListProductProps {
    productList: IListProductDto,
    insertAction$: PropFunction<() => void>,
    editAction$: PropFunction<(data: IProductEntity) => void>,
    deleteAction$: PropFunction<(id: number) => void>,
    paginationAction$: PropFunction<(typeAction: string) => void>,
}

export const ListProduct = component$<ListProductProps>(({
    productList,
    insertAction$,
    editAction$,
    deleteAction$,
    paginationAction$,
}) => {
    return (
        <div class="flex flex-col space-y-3 w-full">
            <ListViewHeader
                title={ProductModel.pluralModalName}
                insertAction$={insertAction$}
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
                productList.data?.map(product => (
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
                pagination={{ offset: productList.pagination?.offset?? 0, count: productList.pagination?.count?? 0 }}
            />
        </div>
    )
})
