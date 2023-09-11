import { component$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  type RequestHandler,
  useLocation,
  useNavigate,
  routeLoader$,
} from "@builder.io/qwik-city";


export const useServerTime = routeLoader$(() => {
  return Date.now();
})

export const onRequest: RequestHandler = ({ headers, query, json }) => {
  headers.set('Cache-Control', 'private');
  if (query.get('format') === 'json') {
    json(200, { message: 'Hello World' });
  }
  console.log('onRequest');
};


export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const serverTime = useServerTime();

  return (
    <div>
      <div>Hola {loc.params.username}!!!</div>
      <div>
        <button onClick$={() => nav()}>Refresh</button>
        <p>Server Time: {serverTime.value}</p>
      </div>
    </div>
  )
});


export const head: DocumentHead = {
  // This will used to resolve the <title> of the page
  title: 'UserPage',
  meta: [
    {
      name: 'description',
      content: 'This is the user page',
    },
  ]
}