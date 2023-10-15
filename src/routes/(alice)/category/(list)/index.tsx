import { component$, $, useSignal } from "@builder.io/qwik";
import { routeAction$, routeLoader$, useLocation, useNavigate, z, zod$ } from "@builder.io/qwik-city";
import { CategoryController } from "~/presentation/controllers/category.controller";
import type { IListCategoryDto } from "~/domain/dtos/category.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { ICategoryEntity } from "~/domain/entity/category.entity";
import { Modal } from '~/components/shared/modal/Modal';
import { ListCategory } from "~/components/category/ListCategory";
import { FormCategory } from "~/components/category/FormCategory";
import { Pagination } from "~/domain/model/pagination.model";


export const useGetCategoryList = routeLoader$<IListCategoryDto>(async (requestEvent) => {
    let offset = Number(requestEvent.query.get('offset') || '0')
    if (isNaN(offset)) offset = 0
    const oCategoryController = new CategoryController(requestEvent)
    const data = await oCategoryController.getAllPagination({ offset, limit: AppConfig.PAGINATION.limit })

    return data
})

export const useDeleteCategory = routeAction$(async (object, requestEvent) => {
    const oCategoryController = new CategoryController(requestEvent)
    const data = await oCategoryController.delete(Number(object.id))
    return data
})

export const useRegisterCategory = routeAction$(async (category, requestEvent) => {
    const oCategoryController = new CategoryController(requestEvent)
    let data
    if (category.typeAction == AppConfig.ACTION.insert)
        data = await oCategoryController.insert(category)
    else {
        const id = parseInt(category.id)
        const oCategoryController = new CategoryController(requestEvent)
        data = await oCategoryController.update(id, category)
    }
    if (!data.success)
        return {
            success: false,
            message: data.message
        }
    return {
        data,
        success: true,
        message: data.message
    }
},
    zod$({
        typeAction: z.string(),
        id: z.string(),
        name: z.string().min(3, 'Mínimo 3 caracter'),
    })

);

export const usePaginationCategory = routeAction$( () => {
})


export default component$(() => {
    const categoryListResponse = useGetCategoryList()
    const deleteActionRoute = useDeleteCategory()
    const paginationRouter = usePaginationCategory()
    const location = useLocation()
    const nav = useNavigate()
    const msgLoadingSignal = useSignal('')

    // funcionalidad Form
    const typeActionSignal = useSignal(AppConfig.ACTION.insert);
    const showModalSignal = useSignal(false)

    // fields
    const idSignal = useSignal('');
    const nameSignal = useSignal('');

    const showModalCallback = $(() => {
        showModalSignal.value = true
    });

    const closeModalCallback = $(() => {
        showModalSignal.value = false
    });

    const insertAction = $(() => {
        typeActionSignal.value = AppConfig.ACTION.insert
        showModalCallback()
    })

    const editAction = $((category: ICategoryEntity) => {
        idSignal.value = category.id.toString();
        nameSignal.value = category.name;

        typeActionSignal.value = AppConfig.ACTION.update;
        showModalCallback()
    })

    const deleteAction = $(async (id: number) => {
        msgLoadingSignal.value = CustomMessages.msgDelete()
        const data = await deleteActionRoute.submit({ id: id })
        if (data.value.success) msgLoadingSignal.value = CustomMessages.msgDeleteOk()
        else msgLoadingSignal.value = CustomMessages.msgDeleteError()
    })

    const paginationAction = $(async (typeAction: string) => {
        const url = location.url.pathname
        const offset = Pagination.calculateNewOffset({
            typeAction: typeAction,
            offset:categoryListResponse.value.pagination?.offset ?? 0,
            count: categoryListResponse.value.pagination?.count ?? 0,
            limit: AppConfig.PAGINATION.limit
        })
        await nav(`${url}?offset=${offset}`)
        paginationRouter.submit()
    })

    return (
        <>
            <ListCategory
                categoryListResponse={categoryListResponse.value}
                insertAction$={() => insertAction()}
                editAction$={(category: ICategoryEntity) => editAction(category)}
                deleteAction$={(id: number) => deleteAction(id)}
                paginationAction$={(typeAction: string) => paginationAction(typeAction)}
            />

            {
                location.isNavigating && <div>Cargando....</div>
            }

            <div>{msgLoadingSignal.value}</div>

            <Modal
                showModal={showModalSignal.value}
                closeModal={closeModalCallback}
                size='w-10/12'
            >
                <span q: slot='title' class='text-blue-700'></span>
                <div q: slot='content' class='flex flex-col justify-center items-center'>
                    <FormCategory
                        typeActionSignal={typeActionSignal}
                        //fields
                        idSignal={idSignal}
                        nameSignal={nameSignal}
                    />
                </div>
            </Modal>
        </>
    )
});
