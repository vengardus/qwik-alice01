import { type PropFunction, component$ } from "@builder.io/qwik";
import { ItemCategory } from "./ItemCategory";
import { ListViewFooter } from "../shared/listview/ListViewFooter";
import { ListViewHeader } from "../shared/listview/ListViewHeader";
import { ListViewDatatHeader } from "../shared/listview/ListViewDataHeader";
import { type IListCategoryDto } from "~/domain/dtos/category.dto";
import { type ICategoryEntity } from "~/domain/entity/category.entity";
import { CategoryModel } from "~/data/supabase/models/category.model";


export interface ListCategoryProps {
    categoryListResponse: IListCategoryDto,
    insertAction$: PropFunction<() => void>,
    editAction$: PropFunction<(data: ICategoryEntity) => void>,
    deleteAction$: PropFunction<(id: number) => void>,
    paginationAction$: PropFunction<(typeAction: string) => void>,
}

export const ListCategory = component$<ListCategoryProps>(({
    categoryListResponse,
    insertAction$,
    editAction$,
    deleteAction$,
    paginationAction$,
}) => {
    return (
        <div class="flex flex-col space-y-3 w-full">
            <ListViewHeader
                title={CategoryModel.pluralModalName}
                insertAction$={insertAction$}
            />

            <ListViewDatatHeader>
                <div class='w-1/12'>Id</div>
                <div class='w-3/12'>Name</div>
                <div class='w-1/12'>.</div>
                <div class='w-1/12'>.</div>
            </ListViewDatatHeader>

            {/* ListViewData */}
            <div class="flex flex-col space-y-2"> {
                categoryListResponse.data.map(category => (
                    <ItemCategory
                        key={category.id}
                        category={category}
                        editAction$={editAction$}
                        deleteAction$={deleteAction$}
                    />
                ))
            } </div>

            <ListViewFooter
                paginationAction$={(typeAction: string) => paginationAction$(typeAction)}
                pagination={{ offset: categoryListResponse.pagination?.offset?? 0, count: categoryListResponse.pagination?.count?? 0 }}
            />
        </div>
    )
})
