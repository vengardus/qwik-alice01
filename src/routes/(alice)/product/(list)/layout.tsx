import { component$, Slot } from '@builder.io/qwik';
import { type DocumentHead} from '@builder.io/qwik-city';


export default component$(() => {
  return (
      <Slot />
  );
});

export const head: DocumentHead = ({ head }) => {
  return {
    title: (head.title)? `QAlice - ${head.title}` : 'QAlice - Productos',
  };
};