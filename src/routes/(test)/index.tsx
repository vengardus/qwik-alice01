import { component$, $, useTask$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type RequestEventBase, routeLoader$, server$ } from "@builder.io/qwik-city";
import { supabaseClient } from "~/utils/supabase";
import { type ISupabase } from "../tuto/product";
import { type IProduct } from "~/interfaces/product";

const getAllProducts = async (requestEvent:RequestEventBase):Promise<ISupabase> => {
  const supabase = supabaseClient(requestEvent);
  const data = await supabase
    .from('products')
    .select('*')
    .order('name') as ISupabase
  return data
}

export const useGetProducts = routeLoader$(async (requestEvent) => {
  // const supabase = supabaseClient(requestEvent);
  // const data = await supabase
  //   .from('products')
  //   .select('*')
  //   .order('name') as ISupabase
  const data = await getAllProducts(requestEvent)
  console.log('routeLoader', data.data, data.data?.length, 'END')
  // return {
  //   data: data.data ?? [],
  //   error: data.error?.message ?? null,
  //   pagination: {
  //     count: 100,
  //     iniRow: iniRow
  //   }
  // };

  return data
})



const addProductServer = server$(async function () {

  const newProduct = {
    name: 'the name',
    description: 'the name',
    price: 10,
    currency: 'PEN',
  }

  const supabase = supabaseClient(this);
  const data = await supabase
    .from('products')
    .insert([newProduct])
    .select() as ISupabase
  const id = (data.data) ? data.data[0].id : 0

  const dataNew = await getAllProducts(this)

  return {
    success: (data.status == 201) ? true : false,
    id,
    dataNew
  }
})


const deleteProductServer = server$(async function (id: number) {
  const supabase = supabaseClient(this);

  const data = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  console.log('delete:', data, id);

  const dataNew = await getAllProducts(this)

  return ({
    success: (data.status == 204) ? true : false,
    dataNew

  })
})


export default component$(() => {
  const products = useGetProducts()
  // const nav = useNavigate()
  const idSignal = useSignal(0)
  const prodsSignal = useSignal<IProduct[] | null>([])
  const idDeleteSignal = useSignal('');

  const addProduct = $(async () => {
    console.log('add')
    const data = await addProductServer()
    console.log('dataResponse', data, (products.value.data) ? products.value.data.length : '??')
    console.log('dataNew', data.dataNew.data?.length)
    products.value.data = data.dataNew.data
    idSignal.value = data.id
    prodsSignal.value = data.dataNew.data
    //await nav()
  })

  const deleteProduct = $(async () => {
    console.log('del')
    const data = await deleteProductServer(Number(idDeleteSignal.value))
    prodsSignal.value = data.dataNew.data
    
    //await nav()
  })

  useTask$(({ track }) => {
    track(() => products.value.data)
    prodsSignal.value = products.value.data
    console.log('track server ', products.value.data?.length)
  })

  useVisibleTask$(({ track }) => {
    track(() => products.value.data)
    track(() => idSignal.value)
    console.log('track visible', products.value.data?.length)
  })

  return (
    <>
      {
        prodsSignal.value?.map(product => (
          <div key={product.id}>{product.id} - {product.name}</div>
        ))
      }
      {/* products.value.data?.map(product => (
          <div key={product.id}>{product.id} - {product.name}</div>
          ))
        } */}
      <div>
        <button onClick$={() => { addProduct() }}>Add</button>
      </div>
      <div>
        <button onClick$={() => { deleteProduct() }}>Delete</button>
      </div>
      <h3>Lista_UltimoId: {idSignal.value}</h3>
      <h3>Length: {products.value.data?.length}</h3>
      <h3>Length-2: {prodsSignal.value?.length}</h3>
      <div class='flex w-full'>
        <label for="id" class='w-3/12'>Id:</label>
        <input name="id" bind: value={idDeleteSignal} />
      </div>
    </>
  )
});
