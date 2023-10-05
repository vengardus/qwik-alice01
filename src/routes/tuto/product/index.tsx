import { component$, useSignal } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  useLocation,
  zod$, z, 
} from "@builder.io/qwik-city";
import { supabaseClient } from "~/utils/supabase";

export interface ISupabase {
  error: {
    code: string,
    details: any,
    hint: any,
    message: string
  } | null,
  data: any[] | null,
  count: any | null,
  status: number,
  statusText: string
}

export interface IDataProduct {
  data: IProduct[],
  error: string | null
}

export interface IProduct {
  id: number,
  name: string,
  price: number,
  currenct: string
}

const dateTimeNow = () => {
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  return hoy.toUTCString();
}

// export const onGet: RequestHandler = async ({ query, json }) => {
//   const obj: Record<string, string> = {};
//   query.forEach((v, k) => (obj[k] = v));
//   json(200, obj);
// };

export const useProductDetail = routeLoader$<IDataProduct>(async (requestEvent) => {
  console.log('Import:', dateTimeNow())
  const supabase = supabaseClient(requestEvent);
  console.log('Start :', dateTimeNow())
  const data = await supabase
    .from('products')
    .select('*').then(resp => resp) as ISupabase
  
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('End.. :', dateTimeNow())

  // console.log('Request headers:', requestEvent.request.headers);
  // console.log('Request cookies:', requestEvent.cookie);
  // console.log('Request url:', requestEvent.url);
  // console.log('Request method:', requestEvent.method);
  // console.log('Request params:', requestEvent.params);

  return {
    data: data.data ?? [],
    error: data.error?.message ?? null
  }
})

export const useAddProduct = routeAction$((product) => {
  //const productID = await db.users.add(product);
  console.log('routeAction:', product);
  return {
    success: true,
  }
},
  // Zod schema is used to validate that the FormData includes "firstName" and "lastName"
  zod$({
    name: z.string().min(3, 'Mínimo 3 caracter')
  })

);


export default component$(() => {
  const location = useLocation();
  const products = useProductDetail().value;
  const action = useAddProduct();
  const nameSignal = useSignal('initial');
  

  console.log('relatveUrl :', location.url.pathname);
  console.log('absoluteUrl:', location.url.origin + location.url.pathname);
  if ( location.isNavigating )
    console.log('isNavigating');

  return (

    
    <div>
      {location.isNavigating && <p>Loading...</p>}

      {location.isNavigating?
       <div>Loading....</div>
       : 
    

    products.error ?
      <div>Ocurrió un error: {products.error}</div>
      :
      <div>
        {
          products.data.map(product => (
            <div key={product.id}>{product.name}</div>
          ))
        }

        <Form
          action={action}
          onSubmitCompleted$={() => {
            nameSignal.value = '';
            console.log('action', action.value);
          }}
        >
          <input name="name" bind: value={nameSignal} />
          <button type="submit" class='button'>Add Product</button>
          {action.value?.success && <p>Product added successfully</p>}
        </Form>

        {
          action.value?.failed
          && action.value.fieldErrors?.name
          && <p>Name: {action.value.fieldErrors.name}</p>
        }

      </div>
}
      </div>
  )
});