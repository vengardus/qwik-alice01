import { component$, $, useTask$, useSignal, useStore } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, server$, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/controllers/product.controller";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { IProductEntity } from "~/domain/entity/product.entity";
import type { IDataResponse } from "~/domain/dtos/app.dto";
import { Modal } from '~/components/shared/modal/Modal';



export const useGetProducts = routeLoader$<IListProductDto>(async (requestEvent) => {
  // let offset = Number(requestEvent.query.get('offset') || '0')
  // if (offset < 0 || isNaN(offset)) offset = 0;
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
  if (product.typeAction == AppConfig.ACTION.insert) {
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.insert(product)

    return {
      dataResponse: data,
      dataRefresh: (data.success)
        ? await oProductController.getAllPagination({
          offset: Number(product.paginationOffset),
          limit: AppConfig.PAGINATION.limit
        })
        : null
    }
  }
  else {
    const id = parseInt(product.id)
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.update(id, product)
    console.log('register-update', data)
    return {
      dataResponse: data,
      dataRefresh: (data.success)
        ? await oProductController.getAllPagination({
          offset: Number(product.paginationOffset),
          limit: AppConfig.PAGINATION.limit
        })
        : null
    }
  }

},
  zod$({
    name: z.string().min(3, 'Mínimo 3 caracter'),
    description: z.string().min(3, 'Mínimo 3 caracter'),
    currency: z.string().min(3, 'Debe tener 3 caracteres').max(3, 'Debe tener 3 caracteres'),
    price: z.string(),
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
  const actionSubmit = useRegisterProduct();
  const typeActionSignal = useSignal(AppConfig.ACTION.insert);
  const msgFormSignal = useSignal('')

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

  const editAction = $((product: IProductEntity) => {
    idSignal.value = product.id.toString();
    nameSignal.value = product.name;
    descriptionSignal.value = product.description;
    currencySignal.value = product.currency;
    priceSignal.value = product.price.toString();
    typeActionSignal.value = AppConfig.ACTION.update;
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

  const clearInputs = $(() => {
    idSignal.value = '';
    nameSignal.value = '';
    currencySignal.value = 'PEN';
    priceSignal.value = '';
  })

  const postUseRegisterProduct = $(async () => {
    if (!actionSubmit.value?.dataResponse?.success) {
      msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
        ? CustomMessages.msgInsertError()
        : CustomMessages.msgUpdateError()
      return;
    }
    clearInputs()
    productsSignal.value = actionSubmit.value.dataRefresh?.data ?? null
    paginationStore.count = actionSubmit.value.dataRefresh?.pagination?.count ?? paginationStore.count
    msgFormSignal.value = (typeActionSignal.value == AppConfig.ACTION.insert)
      ? CustomMessages.msgInsertOk()
      : CustomMessages.msgUpdateOk()
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

  const showModalCallback = $(() => {
    showModalSignal.value = true
  });
  
  const closeModalCallback = $(() => {
    showModalSignal.value = false
  });



  return (
    <div class='flex space-x-5'>
      <div class='w-[70%]'>
        <div>
          {
            productsSignal.value?.map(product => (
              <div key={product.id} class='flex space-x-3'>
                <div>{product.id}</div>
                <div>{product.name}</div>
                <div>{product.description}</div>
                <div>{product.price}</div>
                <div>{product.currency}</div>
                <div class='w-1/12'><button onClick$={() => editAction(product)}>Edit</button></div>
                <div class='w-1/12'><button onClick$={() => deleteAction(product.id)}>Delete</button></div>
              </div>
            ))
          }
        </div>

        {/* PAGNATION */}
        <div class='flex justify-center space-x-5'>
          <button onClick$={() => paginationAction(AppConfig.PAGINATION.prev)}
            disabled={(paginationStore.offset <= 0) ? true : false}>
            Anteriores
          </button>
          <button onClick$={() => paginationAction(AppConfig.PAGINATION.next)}
            disabled={(paginationStore.offset + AppConfig.PAGINATION.limit >= paginationStore.count) ? true : false}>
            Siguientes
          </button>
          <div class='mt-3'>
            <div>Regs: {
              ((paginationStore.offset + AppConfig.PAGINATION.limit) > paginationStore.count)
                ? paginationStore.count
                : paginationStore.offset + AppConfig.PAGINATION.limit
            } de {paginationStore.count}</div>
          </div>
        </div>

        <div>{msgLoadingSignal.value}</div>
      </div>

      {/* FORM */}
      <div class='w-[30%] border border-gray-500 '>
        <h1 class='text-center'>{(typeActionSignal.value == AppConfig.ACTION.insert) ? 'Nuevo Producto' : 'Modificar Producto'}</h1>
        <Form
          action={actionSubmit}
          class='flex flex-col space-y-2'
          onSubmitCompleted$={() => postUseRegisterProduct()}
        >
          <input name="typeAction" bind: value={typeActionSignal} hidden />
          <input name="paginationOffset" bind: value={paginationOffsetSignal} hidden />

          <div class='flex w-full'>
            <label for="id" class='w-3/12'>Id:</label>
            <input name="id" readOnly bind: value={idSignal} />
          </div>
          <div class='flex'>
            <label for="name" class='w-3/12'>Name:</label>
            <input name="name" bind: value={nameSignal} />
          </div>
          <div class='flex'>
            <label for="description" class='w-3/12'>Descripción:</label>
            <input name="description" bind: value={descriptionSignal} />
          </div>
          <div class='flex'>
            <label for="currency" class='w-3/12'>Moneda:</label>
            <input name="currency" bind: value={currencySignal} />
          </div>
          <div class='flex'>
            <label for="price" class='w-3/12'>Precio:</label>
            <input name="price" bind: value={priceSignal} />
          </div>

          <button type="submit" class='button'>{
            (typeActionSignal.value == AppConfig.ACTION.insert)
              ? 'Agregar Producto'
              : 'Modificar Producto'
          }</button>
        </Form>

        <div>
          <button         
            preventdefault: click
            onClick$={() => {
              showModalCallback()
            }}>ADD (+)</button>
        </div>



        {/* MESSAGES */}
        <div class='mt-3'>
          {
            actionSubmit.isRunning ? <div>{
              (typeActionSignal.value == AppConfig.ACTION.insert)
                ? CustomMessages.msgInsert()
                : CustomMessages.msgUpdate()
            }</div> : <div></div>
          }

          <div>{msgFormSignal.value}</div>

          {
            actionSubmit.value?.failed
            && actionSubmit.value.fieldErrors?.name
            && <p>Name: {actionSubmit.value.fieldErrors.name}</p>
          }
          {
            actionSubmit.value?.failed
            && actionSubmit.value.fieldErrors?.description
            && <p>Description: {actionSubmit.value.fieldErrors.description}</p>
          }
          {
            actionSubmit.value?.failed
            && actionSubmit.value.fieldErrors?.currency
            && <p>Currency: {actionSubmit.value.fieldErrors.currency}</p>

          }
          {
            actionSubmit.value?.failed
            && actionSubmit.value.fieldErrors?.price
            && <p>Price: {actionSubmit.value.fieldErrors.price}</p>

          }
        </div>

      </div>


      {/* MOdal */}

      <Modal
        showModal={showModalSignal.value}
        closeModal={closeModalCallback}
        size='md'
      >
        <span q: slot='title' class='text-blue-700'>My title</span>
        <div q: slot='content' class='flex flex-col justify-center items-center'>
          Mi Modal
        </div>
      </Modal>

    </div>
  )
});
