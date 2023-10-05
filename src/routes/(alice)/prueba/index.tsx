import { component$, useSignal, $ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$, useNavigate, z, zod$ } from "@builder.io/qwik-city";
import { ProductController } from "~/controllers/product.controller";
import { AppConfig } from "~/domain/app.config";
import { Product } from "~/domain/model/product.model";
import { type ISupabaseResponse, Supabase } from "~/infrastructure/data/supabase/supabase";

export const useGetProducts = routeLoader$(async (requestEvent) => {
  const offset = Number(requestEvent.query.get('offset') || '0')

  const oProductController = new ProductController(requestEvent)
  const data = oProductController.getAllPagination({ offset, limit: AppConfig.PAGINATION.limit })
  return data
})

export const useRegisterProduct = routeAction$(async (product, requestEvent) => {
  const [messageError, registerProductDto] = Product.validateObject(product)
  if (messageError)
    return {
      success: false
    }
  const supabase = Supabase.connect(requestEvent)
  const data = await supabase
    .from('products')
    .insert([registerProductDto])
    .select() as ISupabaseResponse
  return {
    data,
    success: true
  }

},
  zod$({
    name: z.string().min(3, 'Mínimo 3 caracter'),
    description: z.string().min(3, 'Mínimo 3 caracter'),
    currency: z.string().min(3, 'Debe tener 3 caracteres').max(3, 'Debe tener 3 caracteres'),
    price: z.string().min(1, 'Debe ingresar precio'),
    id: z.string(),
  })

);

export const useDeleteProduct = routeAction$(async (object, requestEvent) => {
  const oProductController = new ProductController(requestEvent)
  const data = await oProductController.delete(Number(object.id))
  return data
})

export default component$(() => {
  const products = useGetProducts()
  const submitAction = useRegisterProduct()
  const deleteAction = useDeleteProduct()
  const nav = useNavigate()
  // fields
  const idSignal = useSignal('');
  const nameSignal = useSignal('');
  const descriptionSignal = useSignal('');
  const currencySignal = useSignal('PEN');
  const priceSignal = useSignal('');

  const idDeleteSignal = useSignal('')

  const postUseRegisterProduct = $(async () => {

  });

  const deleteProduct = $(async (object: { id: string }) => {

    await deleteAction.submit(object)
  })

  const changePagination = $(async (typeAction: string) => {
    const url = '/prueba'
    let offset = products.value.pagination?.offset ?? 0
    const count = products.value.pagination?.count ?? 0
    if (typeAction == AppConfig.PAGINATION.prev) offset -= AppConfig.PAGINATION.limit
    else offset += AppConfig.PAGINATION.limit
    if ((offset + 1) > count) offset = count - 1
    if (offset < 1) offset = 0
    await nav(`${url}?offset=${offset}`)
  })

  return (
    <>
      <div>
        {
          products.value.data?.map((product) => (
            <div key={product.id}>
              {product.id} - {product.name} - {product.description} - {product.price}
            </div>
          ))
        }
        <div class="my-3">
          <p>offset: {products.value.pagination?.offset}</p>
          <p>Count: {products.value.pagination?.count}</p>
        </div>
      </div>

      <div class="bg-gray-700">
        <Form
          action={submitAction}
          class='flex flex-col space-y-2 w-full'
          onSubmitCompleted$={() => postUseRegisterProduct()}
        >

          <div class='flex w-full'>
            <label for="id" class=''>Id:</label>
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


          <div class="py-3">
            <button type="submit">Agregar</button>
          </div>

          <>
            {
              submitAction.isRunning &&
              <p class="text-white">Agregando productos</p>
            }
          </>
        </Form>

        <div class="flex space-x-3">
          <button class="" onClick$={() => changePagination(AppConfig.PAGINATION.prev)}>Anterior</button>
          <button onClick$={() => changePagination(AppConfig.PAGINATION.next)}>Siguiente</button>
        </div>


        <div class="py-3">
          <div class='flex w-full'>
            <label for="idDelete" class=''>Id:</label>
            <input name="idDelete" bind: value={idDeleteSignal} />
          </div>
          <button onClick$={() => { deleteProduct({ id: idDeleteSignal.value }) }}>Eliminar</button>
        </div>
      </div>


    </>
  )
});