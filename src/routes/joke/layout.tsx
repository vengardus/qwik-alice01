import { component$, createContextId, Slot, useContextProvider, useStore } from '@builder.io/qwik';

export const jokeContext = createContextId<{ username: string }>('jokeContext');

export default component$(() => {
  const userData = useStore({ username: '?' });
  useContextProvider(jokeContext, userData);

  return (
    <>
      <Slot />
    </>
  );
});