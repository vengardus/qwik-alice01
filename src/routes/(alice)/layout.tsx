import { Slot, component$ } from '@builder.io/qwik';
import Navbar from '~/components/shared/navbar/Navbar';

export default component$(() => {

  return (
    <>
      <Navbar />
      <main class='flex flex-col relative top-[58px] z-0 px-4'>
        <Slot />
      </main>
    </>
  )
});