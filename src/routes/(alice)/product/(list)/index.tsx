import { component$, $, useSignal, useTask$, useStore } from "@builder.io/qwik";
import { routeAction$, routeLoader$, useLocation, useNavigate, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/presentation/controllers/product.controller";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { IProductEntity } from "~/domain/entity/product.entity";
import { Modal } from '~/components/shared/modal/Modal';
import { ListView } from "~/components/product/(listview)/ListView";
import { FormListView } from "~/components/product/(listview)/FormListView";
import { Pagination } from "~/domain/core/models/pagination.model";
import { ProductModel } from "~/infrastructure/data/supabase/models/product.model";


export const useGetProductList = routeLoader$<IListProductDto>(async (requestEvent) => {
    let offset = Number(requestEvent.query.get('offset') || '0')
    if (isNaN(offset)) offset = 0
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.getAllPagination({ offset, limit: AppConfig.PAGINATION.limit })

    return data
})

export const useDeleteProduct = routeAction$(async (object, requestEvent) => {
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.delete(Number(object.id))
    return data
})

/* Personalizado *******************************************  
    fieldsForm en zod$
*/
export const useRegisterProduct = routeAction$(async (product, requestEvent) => {
    const oProductController = new ProductController(requestEvent)
    let data
    if (product.typeAction == AppConfig.ACTION.insert)
        data = await oProductController.insert(product)
    else {
        const id = parseInt(product.id)
        data = await oProductController.update(id, product)
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
        id: z.string(),
        typeAction: z.string(),
        name: z.string().min(3, 'Mínimo 3 caracter'),
        description: z.string().min(3, 'Mínimo 3 caracter'),
        currency: z.string().min(3, 'Debe tener 3 caracteres').max(3, 'Debe tener 3 caracteres'),
        price: z.string().min(1, 'Debe ingresar precio'),
    })

);

export const usePaginationProduct = routeAction$(() => {
})


export default component$(() => {
    const location = useLocation()
    const nav = useNavigate()
    const productListResponse = useGetProductList()
    const deleteActionRoute = useDeleteProduct()
    const paginationActionRoute = usePaginationProduct()
    interface IComponentStore {
        msgLoading: string
        typeAction: string
        showModal: boolean
    }
    const componentStore = useStore<IComponentStore>({
        msgLoading: '',
        typeAction: AppConfig.ACTION.insert,
        showModal: false
    })

    /* Personalizado **************************************
        fieldsForm
    */
    const idSignal = useSignal('');
    const nameSignal = useSignal('');
    const descriptionSignal = useSignal('');
    const currencySignal = useSignal('');
    const priceSignal = useSignal('');


    const showModalCallback = $(() => {
        componentStore.showModal = true
    });

    const closeModalCallback = $(() => {
        componentStore.showModal = false
    });

    /* Personalizado ****************************************
        initData fieldsForm
    */    
    const initInputs = $(():IProductEntity => {
        const data = ProductModel.initInputs()
        idSignal.value = data.id.toString()
        descriptionSignal.value = data.description
        nameSignal.value = data.name
        currencySignal.value = data.currency
        priceSignal.value = data.price.toString();
        return data
    })

    const insertAction = $(() => {
        initInputs()
        componentStore.typeAction = AppConfig.ACTION.insert
        showModalCallback()
    })

    /* Perosnalizado **************************************
        set fields form
    */
    const editAction = $((product: IProductEntity) => {
        idSignal.value = product.id.toString();
        nameSignal.value = product.name;
        descriptionSignal.value = product.description;
        currencySignal.value = product.currency;
        priceSignal.value = product.price.toString();

        componentStore.typeAction = AppConfig.ACTION.update;
        showModalCallback()
    })

    const deleteAction = $(async (id: number) => {
        componentStore.msgLoading = CustomMessages.msgDelete()
        const data = await deleteActionRoute.submit({ id: id })
        if (data.value.success) componentStore.msgLoading = CustomMessages.msgDeleteOk()
        else componentStore.msgLoading = CustomMessages.msgDeleteError()
    })

    const paginationAction = $(async (typeAction: string) => {
        const offset = Pagination.calculateNewOffset({
            typeAction: typeAction,
            offset: productListResponse.value.pagination?.offset ?? 0,
            count: productListResponse.value.pagination?.count ?? 0,
            limit: AppConfig.PAGINATION.limit
        })
        const url = location.url.pathname
        await nav(`${url}?offset=${offset}`)
        paginationActionRoute.submit()
    })

    useTask$(() => {
        initInputs()
    })


    return (
        <>
            <ListView
                dataList={productListResponse.value}
                insertAction$={() => insertAction()}
                editAction$={(product: IProductEntity) => editAction(product)}
                deleteAction$={(id: number) => deleteAction(id)}
                paginationAction$={(typeAction: string) => paginationAction(typeAction)}
            />

            {
                location.isNavigating && <div>Cargando....</div>
            }

            <div>{componentStore.msgLoading}</div>

            <Modal
                showModal={componentStore.showModal}
                closeModal={closeModalCallback}
                size='w-10/12'
            >
                <span q: slot='title' class='text-blue-700'></span>
                <div q: slot='content' class='flex flex-col justify-center items-center'>
                    <FormListView
                        typeAction={componentStore.typeAction}
                        initInputs$={initInputs}
                        /* Personalizado ***********************************
                            fields
                        */
                        idSignal={idSignal}
                        nameSignal={nameSignal}
                        descriptionSignal={descriptionSignal}
                        currencySignal={currencySignal}
                        priceSignal={priceSignal}
                    />
                </div>
            </Modal>
        </>
    )
});
