import { component$, Slot } from '@builder.io/qwik';
import { 
  type DocumentHead,
  Link 
} from '@builder.io/qwik-city';


export default component$(() => {
  return (
    <div class='bg-gray-900 border text-gray-100 w-full p-3'>
      <Link href='/tuto' class='text-center'><h1>Tutorial</h1></Link>
      <Slot />
    </div>
  );
});

export const head: DocumentHead = ({ head }) => {
  return {
    title: (head.title)? `Tutorial - ${head.title}` : 'Tutorial',
  };
};