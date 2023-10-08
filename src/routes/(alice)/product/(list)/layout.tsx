import { component$, Slot } from '@builder.io/qwik';
import { type DocumentHead} from '@builder.io/qwik-city';


export default component$(() => {
  return (
    <div class='bg-gray-900 text-gray-100'>
      <Slot />
    </div>
  );
});

export const head: DocumentHead = ({ head }) => {
  return {
    title: (head.title)? `Tutorial - ${head.title}` : 'Tutorial',
  };
};