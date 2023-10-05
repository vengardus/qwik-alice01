import { component$, $, useSignal, useTask$, useStore } from "@builder.io/qwik";
import { routeAction$, routeLoader$, useLocation, useNavigate, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/controllers/product.controller";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { IProductEntity } from "~/domain/entity/product.entity";
import { Modal } from '~/components/shared/modal/Modal';
import { ListProduct } from "~/components/product/ListProduct";
import { FormProduct } from "~/components/product/FormProduct";
import { Pagination } from "~/domain/model/pagination.model";


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

export const useRegisterProduct = routeAction$(async (product, requestEvent) => {
    const oProductController = new ProductController(requestEvent)
    let data
    if (product.typeAction == AppConfig.ACTION.insert)
        data = await oProductController.insert(product)
    else {
        const id = parseInt(product.id)
        const oProductController = new ProductController(requestEvent)
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
    const productListResponse = useGetProductList()
    const deleteActionRoute = useDeleteProduct()
    const paginationRouter = usePaginationProduct()
    const location = useLocation()
    const nav = useNavigate()
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

    // fields
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

    const initInputs = $(() => {
        idSignal.value = '';
        descriptionSignal.value = '';
        nameSignal.value = '';
        currencySignal.value = 'USD';
        priceSignal.value = '';
    })

    const insertAction = $(() => {
        componentStore.typeAction = AppConfig.ACTION.insert
        initInputs()
        showModalCallback()
    })

    const editAction = $((product: IProductEntity) => {
        // set fields form
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
        const url = location.url.pathname
        const offset = Pagination.calculateNewOffset({
            typeAction: typeAction,
            offset: productListResponse.value.pagination?.offset ?? 0,
            count: productListResponse.value.pagination?.count ?? 0,
            limit: AppConfig.PAGINATION.limit
        })
        await nav(`${url}?offset=${offset}`)
        paginationRouter.submit()
    })

    useTask$(() => {
        initInputs()
    })


    return (
        <>
            <ListProduct
                productList={productListResponse.value}
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
                    <FormProduct
                        typeAction={componentStore.typeAction}
                        initInputs$={initInputs}
                        //fields
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
