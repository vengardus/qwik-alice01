import { component$, $, useTask$, useSignal, useStore } from "@builder.io/qwik";
import { routeAction$, routeLoader$, server$, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/controllers/product.controller";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { IProductEntity } from "~/domain/entity/product.entity";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import { Modal } from '~/components/shared/modal/Modal';
import { ListProduct } from "~/components/product/ListProduct";
import { FormProduct } from "~/components/product/FormProduct";


export const useGetProducts = routeLoader$<IListProductDto>(async (requestEvent) => {
    const offset = 0
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.getAllPagination({ offset: offset, limit: AppConfig.PAGINATION.limit })

    return data
})

const paginationServer = server$(async function (offset: number, limit: number)
    : Promise<IListProductDto> {
    const oProductController = new ProductController(this)
    const data = await oProductController.getAllPagination({ offset, limit })

    return data
})

const deleteProductServer = server$(async function (id: number, paginationOffset: number)
    : Promise<{
        dataResponse: IDataResponse,
        dataRefresh: IListProductDto | null
    }> {
    const oProductController = new ProductController(this)
    const data = await oProductController.delete(id)
    return {
        dataResponse: data,
        dataRefresh: (data.success)
            ? await oProductController.getAllPagination({ offset: paginationOffset, limit: AppConfig.PAGINATION.limit })
            : null
    }
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

    return {
        dataResponse: data,
        dataRefresh: (data.success)
            ? await oProductController.getAllPagination({
                offset: Number(product.paginationOffset),
                limit: AppConfig.PAGINATION.limit
            })
            : null
    }

},
    zod$({
        name: z.string().min(3, 'Mínimo 3 caracter'),
        description: z.string().min(3, 'Mínimo 3 caracter'),
        currency: z.string().min(3, 'Debe tener 3 caracteres').max(3, 'Debe tener 3 caracteres'),
        price: z.string().min(1, 'Debe ingresar precio'),
        typeAction: z.string(),
        id: z.string(),
        paginationOffset: z.string(),
    })

);


export default component$(() => {
    const products = useGetProducts()
    const productsSignal = useSignal<IProductEntity[] | null>([])
    const msgLoadingSignal = useSignal('')

    // funcionalidad Form
    // const submitAction = useRegisterProduct();
    const typeActionSignal = useSignal(AppConfig.ACTION.insert);


    const showModalSignal = useSignal(false)

    // funcionalidad pagination
    const paginationStore = useStore({
        offset: 0,
        count: 0
    })
    const paginationOffsetSignal = useSignal('0')   // utilizado para enviar en el form al useRegister()

    // fields
    const idSignal = useSignal('');
    const nameSignal = useSignal('');
    const descriptionSignal = useSignal('');
    const currencySignal = useSignal('PEN');
    const priceSignal = useSignal('');


    useTask$(() => {
        productsSignal.value = products.value.data
        paginationStore.offset = products.value.pagination?.offset ?? 0
        paginationStore.count = products.value.pagination?.count ?? 0
    })

    useTask$(({ track }) => {
        track(() => { paginationStore.offset })
        paginationOffsetSignal.value = String(paginationStore.offset)
    })

    const showModalCallback = $(() => {
        showModalSignal.value = true
    });

    const closeModalCallback = $(() => {
        showModalSignal.value = false
    });

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
        // const data = await deleteProductServer(Number(idDeleteSignal.value), paginationStore.offset)
        const data = await deleteProductServer(id, paginationStore.offset)
        if (!data.dataResponse.success) {
            msgLoadingSignal.value = CustomMessages.msgDeleteError()
            return
        }
        productsSignal.value = data.dataRefresh!.data
        paginationStore.count = data.dataRefresh?.pagination?.count ?? paginationStore.count
        msgLoadingSignal.value = CustomMessages.msgDeleteOk()
    })



    const postUseRegisterProduct = $(async (dataRefresh: IListProductDto | null) => {
        productsSignal.value = dataRefresh?.data ?? null
        paginationStore.count = dataRefresh?.pagination?.count ?? paginationStore.count
    });


    const paginationAction = $(async (typeAction: string) => {
        if (typeAction == AppConfig.PAGINATION.next)
            paginationStore.offset += AppConfig.PAGINATION.limit
        else
            paginationStore.offset -= AppConfig.PAGINATION.limit
        if (paginationStore.offset < 0) paginationStore.offset = 0;

        msgLoadingSignal.value = CustomMessages.msgLoading()
        const data = await paginationServer(paginationStore.offset, AppConfig.PAGINATION.limit)
        msgLoadingSignal.value = CustomMessages.msgClean()
        productsSignal.value = data.data
        paginationStore.count = data.pagination?.count ?? 0
    })

    

    return (
        <>
            <ListProduct
                products={productsSignal.value}
                editAction$={(product: IProductEntity) => editAction(product)}
                deleteAction$={(id: number) => deleteAction(id)}
                paginationAction$={(typeAction: string) => paginationAction(typeAction)}
                paginationStore={{ offset: paginationStore.offset, count: paginationStore.count }}
                msgLoading={msgLoadingSignal.value}
                showModalCallback$={() => showModalCallback()}
            />

            <Modal
                showModal={showModalSignal.value}
                closeModal={closeModalCallback}
                size='w-10/12'
            >
                <span q: slot='title' class='text-blue-700'></span>
                <div q: slot='content' class='flex flex-col justify-center items-center'>
                    <FormProduct
                        typeActionSignal={typeActionSignal}
                        paginationOffsetSignal={paginationOffsetSignal}
                        postUseRegisterProduct$={(dataRefresh: IListProductDto | null) => postUseRegisterProduct(dataRefresh)}
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
