import { component$, $, useTask$, useSignal, useStore } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, server$, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/controllers/product.controller";
import type { IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";
import type { IProductEntity } from "~/domain/entity/product.entity";
import type { IDataResponse } from "~/domain/dtos/app.dto";


export const useGetProducts = routeLoader$<IListProductDto>(async (requestEvent) => {
  let offset = Number(requestEvent.query.get('offset') || '0')
  if (offset < 0 || isNaN(offset)) offset = 0;
  console.log('query.offset', offset);

  const oProductController = new ProductController(requestEvent)
  const data = await oProductController.getAllPagination({ offset: offset, limit: AppConfig.PAGINATION.limit })
  console.log('router!!', data.data)
  return data
  //return await oProductController.getAll()
})

// const addProductServer = server$(async function (object: { [key: string]: any }) {

//   const oProductController = new ProductController(this)

//   const data = await oProductController.insert(object)

//   return data
// })

const paginationServer = server$(async function (offset: number, limit: number) {
  const oProductController = new ProductController(this)
  const data = await oProductController.getAllPagination({ offset, limit })
  console.log('refres-pagination', data.pagination)
  return data
})

const deleteProductServer = server$(async function (id: number, paginationOffset: number)
  : Promise<{ dataResponse: IDataResponse, dataRefresh: IListProductDto | null }> {
  const oProductController = new ProductController(this)
  const data = await oProductController.delete2(id)
  console.log('delete-offset', paginationOffset)
  return {
    dataResponse: data,
    dataRefresh: (data.success)
      ? await oProductController.getAllPagination({ offset: paginationOffset, limit: AppConfig.PAGINATION.limit })
      : null
  }
})

export const useRegisterProduct = routeAction$(async (product, requestEvent) => {
  let offset = Number(requestEvent.query.get('offset') || '0')
  if (offset < 0 || isNaN(offset)) offset = 0;

  if (product.typeAction == AppConfig.ACTION.insert) {
    const oProductController = new ProductController(requestEvent)
    const data = await oProductController.insert2(product)

    return {
      dataResponse: data,
      dataRefresh: (data.success)
        ? await oProductController.getAllPagination({ offset: Number(product.paginationOffset), limit: AppConfig.PAGINATION.limit })
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
    paginationLimit: z.string()
  })

);



export default component$(() => {
  const products = useGetProducts()
  // const nav = useNavigate()
  const prodsSignal = useSignal<IProductEntity[] | null>([])
  const idDeleteSignal = useSignal('');
  const msgLoading = useSignal('')

  // funcionalidad Form
  const actionSubmit = useRegisterProduct();
  const typeAction = useSignal(AppConfig.ACTION.insert);
  const paginationStore = useStore({
    offset: 0,
    limit: AppConfig.PAGINATION.limit,
    count: 0
  })

  // fields
  const idSignal = useSignal('');
  const nameSignal = useSignal('');
  const descriptionSignal = useSignal('');
  const currencySignal = useSignal('PEN');
  const priceSignal = useSignal('');

  const paginationOffsetSignal = useSignal('0')
  const paginationLimitSignal = useSignal(String(AppConfig.PAGINATION.limit))


  useTask$(() => {
    // track(() => { products.value.data })
    prodsSignal.value = products.value.data
    paginationStore.offset = products.value.pagination?.offset ?? 0
    paginationStore.count = products.value.pagination?.count ?? 0
    paginationStore.limit = AppConfig.PAGINATION.limit
    console.log('track server ', paginationStore)
  })

  useTask$(({ track }) => {
    track(() => { paginationStore.offset })
    track(() => { paginationStore.limit })
    paginationOffsetSignal.value = String(paginationStore.offset)
    paginationLimitSignal.value = String(paginationStore.limit)
  })

  // const addProduct = $(async () => {
  //   msgLoading.value = CustomMessages.msgInsert()
  //   const data = await addProductServer({
  //     name: 'ASÍRADORA',
  //     description: 'description 3',
  //     price: '14.00',
  //     currency: 'PEN'
  //   })
  //   console.log('ADDProduct:')
  //   console.log('ADD:', data.dataRefresh!.data)
  //   if (!data.dataResponse!.success) {
  //     msgLoading.value = CustomMessages.msgInsertError(data.dataResponse!.message!)
  //     return
  //   }
  //   prodsSignal.value = data.dataRefresh!.data
  //   paginationStore.offset = data.dataResponse.pagination?.offset ?? 0
  //   paginationStore.count = data.dataResponse.pagination?.count ?? 0
  //   await nav()
  //   //msgLoading.value = CustomMessages.msgInseActin
  // })

  const deleteAction = $(async () => {
    msgLoading.value = CustomMessages.msgDelete()
    const data = await deleteProductServer(Number(idDeleteSignal.value), paginationStore.offset)
    if (!data.dataResponse.success) {
      msgLoading.value = CustomMessages.msgDeleteError()
      return
    }
    prodsSignal.value = data.dataRefresh!.data
    msgLoading.value = CustomMessages.msgDeleteOk()
    // await nav()
  })

  const postUseRegisterProduct = $(async () => {
    console.log('post insert', actionSubmit.value)
    if (!actionSubmit.value?.dataResponse?.success)
      return;

    idSignal.value = '';
    nameSignal.value = '';
    currencySignal.value = 'PEN';
    priceSignal.value = '';


    prodsSignal.value = actionSubmit.value.dataRefresh!.data
    //paginationStore.offset = actionSubmit.value.dataRefresh?.pagination?.offset ?? 0
    paginationStore.count = actionSubmit.value.dataRefresh?.pagination?.count ?? paginationStore.count

    console.log('postUseRegisterProd-dataResponse', actionSubmit.value.dataResponse.pagination)
    console.log('post insert-pagination', paginationStore)

    //await nav()
    // const url = '/product'
    // await nav(`${url}?offset=${paginationStore.offset}`)
  });


  const paginationAction = $(async (typeAction: string) => {
    if (typeAction == AppConfig.PAGINATION.next)
      paginationStore.offset += paginationStore.limit;
    else
      paginationStore.offset -= paginationStore.limit;
    if (paginationStore.offset < 0) paginationStore.offset = 0;

    const data = await paginationServer(paginationStore.offset, paginationStore.limit)

    prodsSignal.value = data.data
    paginationStore.count = data.pagination?.count ?? 0
    console.log('post-pagination', paginationStore)
  })



  return (
    <div class='flex space-x-5'>
      <div class='w-[70%]'>
        <div>
          {
            prodsSignal.value?.map(product => (
              <div key={product.id} class='flex space-x-3'>
                <div>{product.id}</div>
                <div>{product.name}</div>
                <div>{product.description}</div>
                <div>{product.price}</div>
                <div>{product.currency}</div>
              </div>
            ))
          }
        </div>


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
            <div>PaginationStore: {paginationStore.offset} - {paginationStore.limit} - {paginationStore.count}</div>
          </div>
          <div class='mt-3'>
            <div>PaginationFields: {paginationOffsetSignal.value} - {paginationLimitSignal.value} </div>
          </div>
        </div>



        <div class='my-3 flex space-x-5'>
          {/* <button onClick$={() => { addProduct() }}>Add</button> */}
          <button onClick$={() => { deleteAction() }}>Delete</button>
        </div>

        <div>{msgLoading.value}</div>

        <div class='flex w-full'>
          <label for="id" class='w-3/12'>Id:</label>
          <input name="id" bind: value={idDeleteSignal} />
        </div>
      </div>

      <div class='w-[30%] border border-gray-500 '>
        <h1 class='text-center'>{(typeAction.value == AppConfig.ACTION.insert) ? 'Nuevo Producto' : 'Modificar Producto'}</h1>
        <Form
          action={actionSubmit}
          class='flex flex-col space-y-2'
          onSubmitCompleted$={() => postUseRegisterProduct()}
        >
          <input name="typeAction" bind: value={typeAction} hidden />
          <input name="paginationOffset" bind: value={paginationOffsetSignal} hidden />
          <input name="paginationLimit" bind: value={paginationLimitSignal} hidden />

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
            (typeAction.value == AppConfig.ACTION.insert)
              ? 'Agregar Producto'
              : 'Modificar Producto'
          }</button>
        </Form>

        <div class='mt-3'>
          {
            actionSubmit.isRunning ? <div>{CustomMessages.msgInsert()}</div> : <div></div>
          }
          {actionSubmit.value?.dataResponse?.success
            ? <p>{(typeAction.value == AppConfig.ACTION.insert)
              ? 'Product agregado satisfactoriamente.'
              : 'Producto modificado satisfactoriamenete.'}
            </p>
            : <div>{actionSubmit.value?.dataResponse?.message}</div>
          }

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
    </div>
  )
});
