import { component$, $, useTask$, useSignal } from "@builder.io/qwik";
import { routeLoader$, server$, useNavigate } from "@builder.io/qwik-city";
import { type IProduct } from "~/interfaces/product";
import { ProductController } from "../product.controller";
import { type IListProductDto } from "~/domain/dtos/product.dto";
import { CustomMessages } from "~/domain/messages/customMessages";
import { AppConfig } from "~/domain/app.config";


export const useGetProducts = routeLoader$<IListProductDto>(async (requestEvent) => {
  let iniRow = Number(requestEvent.query.get('iniRow') || '0')
  if ( iniRow < 0 || isNaN(iniRow) ) iniRow = 0;
  console.log('query.iniRow', iniRow);
  
  const oProductController = new ProductController(requestEvent)
  return await oProductController.getAllPagination({offset:iniRow, limit:AppConfig.PAGINATION.limit})
})

const addProductServer = server$(async function (object: { [key: string]: any }) {
  const oProductController = new ProductController(this)
  const data = await oProductController.insert(object)

  return data
})

const deleteProductServer = server$(async function (id: number) {
  const oProductController = new ProductController(this)
  const data = await oProductController.delete(id)

  return data
})

export default component$(() => {
  const products = useGetProducts()
  const nav = useNavigate()
  const idSignal = useSignal(0)
  const prodsSignal = useSignal<IProduct[] | null>([])
  const idDeleteSignal = useSignal('');
  const msgLoading = useSignal('')


  const addProduct = $(async () => {
    msgLoading.value = CustomMessages.msgInsert()
    const data = await addProductServer({
      name: 'name 5',
      description: 'description 3',
      price: '14.00',
      currency: 'PEN'
    })
    if (!data.dataResponse!.success) {
      msgLoading.value = CustomMessages.msgInsertError(data.dataResponse!.message!)
      return
    }
    idSignal.value = data.dataResponse!.data
    prodsSignal.value = data.dataRefresh!.data
    await nav()
    msgLoading.value = CustomMessages.msgInsertOk()

  })

  const deleteProduct = $(async () => {
    msgLoading.value = CustomMessages.msgDelete()
    const data = await deleteProductServer(Number(idDeleteSignal.value))
    if (!data.dataResponse.success) {
      msgLoading.value = CustomMessages.msgDeleteError()
      return
    }
    prodsSignal.value = data.dataRefresh!.data
    msgLoading.value = CustomMessages.msgDeleteOk()
    await nav()
  })

  useTask$(() => {
    prodsSignal.value = products.value.data
    console.log('track server ', products.value.data)
  })

  return (
    <>
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
      <div class='my-3 flex space-x-5'>
        <button onClick$={() => { addProduct() }}>Add</button>
        <button onClick$={() => { deleteProduct() }}>Delete</button>
      </div>

      <div>{msgLoading.value}</div>

      <div class='flex w-full'>
        <label for="id" class='w-3/12'>Id:</label>
        <input name="id" bind: value={idDeleteSignal} />
      </div>
    </>
  )
});
