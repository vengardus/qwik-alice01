import { type PropFunction, component$ } from "@builder.io/qwik"

export interface ListViewHeaderProps {
  title: string
  insertAction$: PropFunction<() => void>,
}
export const ListViewHeader = component$<ListViewHeaderProps>(({
  title,
  insertAction$
}) => {
  return (
    <div class="flex w-full items-center">
      <h2 class="w-10/12 text-center">{title}</h2>
      <div class="w-2-12 text-right">
        <button
          preventdefault: click
          onClick$={() => {
            insertAction$()
          }}>Agregar(+)</button>
      </div>
    </div>
  )
})