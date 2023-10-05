import { component$, $, useSignal } from "@builder.io/qwik";
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
    console.log('loader', data)
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
    const msgLoadingSignal = useSignal('')

    // funcionalidad Form
    const typeActionSignal = useSignal(AppConfig.ACTION.insert);
    const showModalSignal = useSignal(false)

    // fields
    const idSignal = useSignal('');
    const nameSignal = useSignal('');
    const descriptionSignal = useSignal('');
    const currencySignal = useSignal('PEN');
    const priceSignal = useSignal('');

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

    const editAction = $((product: IProductEntity) => {
        idSignal.value = product.id.toString();
        nameSignal.value = product.name;
        descriptionSignal.value = product.description;
        currencySignal.value = product.currency;
        priceSignal.value = product.price.toString();

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
            offset: productListResponse.value.pagination?.offset ?? 0,
            count: productListResponse.value.pagination?.count ?? 0,
            limit: AppConfig.PAGINATION.limit
        })
        await nav(`${url}?offset=${offset}`)
        paginationRouter.submit()
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

            <div>{msgLoadingSignal.value}</div>

            <Modal
                showModal={showModalSignal.value}
                closeModal={closeModalCallback}
                size='w-10/12'
            >
                <span q: slot='title' class='text-blue-700'></span>
                <div q: slot='content' class='flex flex-col justify-center items-center'>
                    <FormProduct
                        typeActionSignal={typeActionSignal}
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
