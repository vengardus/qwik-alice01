import { component$, useSignal, $, useTask$, useStore } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, server$, useLocation, useNavigate, z, zod$ } from '@builder.io/qwik-city';

import { supabaseClient } from '~/utils/supabase';
import { type ISupabase } from '~/interfaces/supabase';
import type { IDataProduct, IProduct } from '~/interfaces/product';
import { ListProduct } from '~/components/products/ListProduct';
import { ACTION, PAGINATION } from '~/business/general';
import { validateProduct } from '~/business/product';


export const useGetProducts = routeLoader$<IDataProduct>(async (requestEvent) => {
  const supabase = supabaseClient(requestEvent);
  let iniRow = Number(requestEvent.query.get('iniRow') || '0')
  if (isNaN(iniRow) || iniRow < 0) iniRow = 0;
  const offSet = iniRow + PAGINATION.limit - 1;
  const data = await supabase
    .from('products')
    .select('*')
    .order('name') as ISupabase
  console.log('routerLoad:', iniRow, offSet, 'data.count')
  return {
    data: data.data ?? [],
    error: data.error?.message ?? null,
    pagination: {
      count: 100,
      iniRow: iniRow
    }
  };
})

export const useActionProduct = routeAction$(async (product, requestEvent) => {
  const rsptaValidate = validateProduct(product)
  if (!rsptaValidate.success)
    return rsptaValidate

  const newProduct = {
    name: rsptaValidate.data.name,
    description: rsptaValidate.data.name,
    price: rsptaValidate.data.price,
    currency: rsptaValidate.data.currency,
  }

  if (product.typeAction == ACTION.insert) {
    // insert db
    const supabase = supabaseClient(requestEvent);
    const data = await supabase
      .from('products')
      .insert([newProduct])
      .select()
    return {
      success: (data.status == 201) ? true : false,
    }
  }
  else {
    // update db
    console.log('uddate:', product, parseInt(product.id))
    const supabase = supabaseClient(requestEvent);
    const data = await supabase
      .from('products')
      .update(
        {
          name: product.name,
          description: product.name,
          price: rsptaValidate.data.price,
          currency: product.currency,
        }
      )
      .eq('id', parseInt(product.id))


    console.log(data);
    return {
      success: (data.status == 204) ? true : false,
    }
  }
},
  // Zod schema is used to validate that the FormData includes "firstName" and "lastName"
  zod$({
    name: z.string().min(3, 'Mínimo 3 caracter'),
    currency: z.string().min(3, 'Debe tener 3 caracteres').max(3, 'Debe tener 3 caracteres'),
    price: z.string(),

    typeAction: z.string(),
    id: z.string(),
  })

);

const deleteProduct = server$(async function (id: number) {
  const supabase = supabaseClient(this);

  const data = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  console.log('delete:', data);

  return (data.status == 204) ? true : false;
})


export default component$(() => {
  const productsSignal = useGetProducts();
  const actionSubmit = useActionProduct();
  const location = useLocation();
  const typeAction = useSignal(ACTION.insert);
  // fields
  const idSignal = useSignal('');
  const nameSignal = useSignal('');
  const currencySignal = useSignal('PEN');
  const priceSignal = useSignal('');
  const nav = useNavigate()
  const deleteSignal = useSignal(false)

  const actionEdit = $((product: IProduct) => {
    idSignal.value = product.id.toString();
    nameSignal.value = product.name;
    currencySignal.value = product.currency;
    priceSignal.value = product.price.toString();
    typeAction.value = ACTION.update;
  })

  const actionDelete = $(async (id: number) => {

    const deleteOk = await deleteProduct(id);
    alert(deleteOk ? 'Producto eliminado satisfactoriamente.' : 'Error al eliminar producto.')
    if (deleteOk) {
      console.log('pre-nav')
      await nav();
      deleteSignal.value = true
      console.log('post-nav')
    }
  })

  const clearInputs = $(() => {
    if (!actionSubmit.value?.success)
      return;
    return;

    idSignal.value = '';
    nameSignal.value = '';
    currencySignal.value = 'PEN';
    priceSignal.value = '';   
  });

  // useTask$(({track})=>{
  //   track(() => actionSubmit.value?.success);
  //   if ( actionSubmit.value?.success) {
  //     console.log('track', actionSubmit.value.success);
  //     // nav();
  //   }
  // })

  // useTask$(({track})=>{
  //   track(() => productsSignal.value.data);
  //   console.log('track productSignal', productsSignal.value.pagination)
  // })


  console.log('Index;', productsSignal.value.pagination)
  return (
    <div class='flex flex-row space-x-3 w-full px-4'>
      <div class='w-[70%] border border-gray-500'>
        {
          location.isNavigating
            ? <div class=''>Loading...</div>
            : <ListProduct
              products={productsSignal.value.data}
              actionEdit$={(product: IProduct) => actionEdit(product)}
              actionDelete$={(id: number) => actionDelete(id)}
              pagination={productsSignal.value.pagination}
            />
        }
      </div>

      <div class='w-[30%] border border-gray-500 '>
        <h1 class='text-center'>{(typeAction.value == ACTION.insert) ? 'Nuevo Producto' : 'Modificar Producto'}</h1>
        <Form
          action={actionSubmit}
          class='flex flex-col space-y-2'
          onSubmitCompleted$={() => clearInputs()}
        >
          <input name="typeAction" bind: value={typeAction} hidden />
          <div class='flex w-full'>
            <label for="id" class='w-3/12'>Id:</label>
            <input name="id" readOnly bind: value={idSignal} />
          </div>
          <div class='flex'>
            <label for="name" class='w-3/12'>Name:</label>
            <input name="name" bind: value={nameSignal} />
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
            (typeAction.value == ACTION.insert)
              ? 'Agregar Producto'
              : 'Modificar Producto'
          }</button>
        </Form>

        {actionSubmit.value?.success
          ? <p>{(typeAction.value == ACTION.insert)
            ? 'Product agregado satisfactoriamente.'
            : 'Producto modificado satisfactoriamenete.'}
          </p>
          : <div>{actionSubmit.value?.message}</div>
        }

        {
          actionSubmit.value?.failed
          && actionSubmit.value.fieldErrors?.name
          && <p>Name: {actionSubmit.value.fieldErrors.name}</p>
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
  );

});