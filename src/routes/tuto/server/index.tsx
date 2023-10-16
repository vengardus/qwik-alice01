import { Signal, component$, useSignal, useTask$, $, useVisibleTask$ } from '@builder.io/qwik';
import { RequestHandler, routeLoader$, server$, useLocation } from '@builder.io/qwik-city';
// import { supabaseClient } from '~/utils/supabase';
// import product, { IDataProduct, ISupabase, IProduct } from '../product';

// export const prodLoader = routeLoader$(async () => {
//   console.log('routerLOader');
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   console.log('routerLOader2');
//   return '';
// });

const stream = server$(async function* () {
  for (let i = 0; i < 10; i++) {
    yield i;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});

const getProduct = server$((category: string) => {
  console.log('server$', category);
  return `My product in ${category}`;
})

const getProductFunction = server$(async function (category: string) {
  console.log('server$ function');
  console.log(this.env.get('DB_APP_KEY'));
  
  return {
    product: `My product in ${category} by server function`,
    key: this.env.get('DB_APP_KEY')
  };
})

const getProductDB = server$(async function (pos:number=0) {
  // const supabase = supabaseClient(this);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // const data = await supabase
  //   .from('products')
  //   .select('*').then(resp => resp) as ISupabase;
  
  console.log('getProductDB');


  // if ( data.data?.length ) {
  //   const products = data.data as IDataProduct[]
  //   return products[0].data[0].name
  // }
  // return data.data![pos].name;
})

// export const onGet: RequestHandler = async ({ json }) => {
//   json(200, { hello: 'world' });
// };

export default component$(() => {
  const message = useSignal('');
  const myProduct = getProduct('myCategory');
  const signalProduct = useSignal('');
  const signalKey = useSignal('');
  const loc = useLocation();
  const isNavigatingSignal = useSignal('true');
  
  const x = $(async () => {
    // signalProduct.value = await getProductDB();
    isNavigatingSignal.value = 'false';
    console.log('the function', isNavigatingSignal.value)
  })

  //x();

  useTask$(async () => {
    // signalProduct.value = await getProductDB();
    console.log('listo!');
    isNavigatingSignal.value = 'false';
  })


  
  return (

    <div>

      {isNavigatingSignal.value=='true'? <div>Loading...</div> : <div>Listo</div>}

      <div>
        Len: {signalProduct.value}
      </div>
      <div>
        isNavigating: {isNavigatingSignal.value}
      </div>

      <button
        onClick$={async () => {
          const response = await stream();
          for await (const i of response) {
            message.value += ` ${i}`;
          }
        }}
      >
        start
      </button>
      <div>{message.value}</div>

      <div>{myProduct}</div>

      <button onClick$={async () => {
        signalProduct.value = await getProduct('myCategory 2')
      }}>My product</button>
      <div>{signalProduct.value}</div>

      <button onClick$={async () => {
        const result = (await getProductFunction('myCategory 3'));
        signalProduct.value = result.product;
        signalKey.value = result.key!;
      }}>My product by server function</button>
      <div>Product: {signalProduct.value}</div>
      <div>PUBLIC_APP_KEY: {signalKey.value} </div>

      <button onClick$={async () => {
        const result = (await getProductDB(1));
        console.log(result);
        // signalProduct.value = result;
      }}>My product from DB</button>
      <div>Product: {signalProduct.value}</div>
    </div>
  );
});