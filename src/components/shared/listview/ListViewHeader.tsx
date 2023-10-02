import { type PropFunction, component$ } from "@builder.io/qwik"

export interface ListViewHeaderProps {
  title: string
  showModalCallback$: PropFunction<() => void>
}
export const ListViewHeader = component$<ListViewHeaderProps>(({
  title,
  showModalCallback$
}) => {
  return (
    <div class="flex w-full items-center">
      <h1 class="w-10/12 text-center">{title}</h1>
      <div class="w-2-12 text-right">
        <button
          preventdefault: click
          onClick$={() => {
            showModalCallback$()
          }}>Agregar(+)</button>
      </div>
    </div>
  )
})