import { component$ } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";


export default component$(() => {
  const nav = useNavigate()
  return (

    <div class='flex flex-col space-y-3 '>
      <div class='flex space-x-3'>
        <Link href='/tuto/user/gardus'>User (prefered Link) </Link>
        <button onClick$={() => nav('/tuto/user/gardus')}>User (useNavigation)</button>
      </div>
      <div class='flex space-x-3'>
        <Link href='/tuto/product'>Product</Link>
      </div>
    </div>
  )
});