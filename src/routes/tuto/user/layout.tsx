import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class='border'>
      <h2>1. Layout User</h2>
      <Slot />
    </div>
  );
});