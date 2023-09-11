import { component$, createContextId, Slot, useContextProvider, useStore } from '@builder.io/qwik';

export interface ILecturaMedidor  {
  id: number,
  fecha: string,
  lectura: number,
}

export const lecturaMedidorContext = createContextId<ILecturaMedidor[]>('medidorContext')

export default component$(() => {
  const userData  = useStore<ILecturaMedidor[]>([{id:10, fecha:'12/12/2023', lectura:1234}])
  useContextProvider(lecturaMedidorContext, userData)
  
  return (
    <>
      <Slot />
    </>
  );
});