import { component$, useContext, $ } from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";
import { lecturaMedidorContext } from "./layout";

export const useLecturaAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log('LECTURA', props);
});

export default component$(() => {
  const lecturas = useContext(lecturaMedidorContext)
  // const lecturaAction = useLecturaAction();
  
  const submitLecturaAction = $(() => {
    lecturas.push({id:1, lectura:12367, fecha:'14/12/2023'})
  })

  return (
    <>
      <div class='flex flex-col w-full justify-center items-center'>
        <Form /*action={lecturaAction}*/ class='flex flex-col w-[50%] border p-2 space-y-3'>
          <h3 class='text-center pb-5'>Lectura Medidor</h3>
          <div class='flex items-center justify-around px-7 '>
            <label for="date" class='w-[40%]'>Fecha:</label>
            <input type="date" id="date" name="date" class='w-[60%]' />
          </div>
          <div class='flex items-center px-7'>
            <label for="lectura" class='w-[40%]'>Lectura:</label>
            <input type="number" id="lectura" name="lectura" class='w-[60%]' />
          </div>
          <div class='flex items-center justify-end px-7'>
            <button name="ok" id="ok" class='py-3 px-10'
            onClick$={[submitLecturaAction]}>OK</button>
          </div>
        </Form>

        <section class='flex flex-col w-[50%] justify-center items-center mt-7'>
          <h3>Ultimas lecturas</h3>

          <div class='flex w-full m-3 bg-gray-800 py-3'>
            <div class='flex items-center justify-center px-7 w-6/12'>Fecha</div>
            <div class='flex items-center justify-center px-7 w-6/12'>Lectura</div>
          </div>

          {
            lecturas.map(lectura => (
              <article key={lectura.id} class='flex w-full'>
                <div class='flex items-center justify-center px-7 w-6/12'>
                  {lectura.fecha}
                </div>
                <div class='flex items-center justify-center px-7 w-6/12'>
                {lectura.lectura}
                </div>
              </article>
            ))
          }
        </section>

        <a
      href="/about"
      preventdefault:click // This will prevent the default behavior of the "click" event.
      onClick$={() => {
        // event.PreventDefault() will not work here, because handler is dispatched asynchronously.
        alert('Do something else to simulate navigation...');
      }}
    >
      Go to about page
    </a>

      </div>

    </>
  )
});