import { component$ } from "@builder.io/qwik";
import { ItemListView } from "./ItemListView";
import { ListViewFooter } from "../../shared/listview/ListViewFooter";
import { ListViewHeader } from "../../shared/listview/ListViewHeader";
import { ListViewDatatHeader } from "../../shared/listview/ListViewDataHeader";
import { type IListProductDto } from "~/domain/dtos/product.dto";
import { type IProductEntity } from "~/domain/entity/product.entity";
import { ProductModel } from "~/infrastructure/data/supabase/models/product.model";
import { type ListViewProps } from "~/domain/core/interfaces/listview.interface";


export const ListView = component$<ListViewProps<IListProductDto, IProductEntity>>(({
    dataList,
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

            {/* ListViewItem */}
            <div class="flex flex-col space-y-2"> {
                dataList.data?.map(item => (
                    <ItemListView
                        key={item.id}
                        item={item}
                        editAction$={editAction$}
                        deleteAction$={deleteAction$}
                    />
                ))
            } </div>

            <ListViewFooter
                paginationAction$={(typeAction: string) => paginationAction$(typeAction)}
                pagination={{ offset: dataList.pagination?.offset?? 0, count: dataList.pagination?.count?? 0 }}
            />
        </div>
    )
})
