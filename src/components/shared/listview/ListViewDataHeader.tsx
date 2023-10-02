import { Slot, component$ } from "@builder.io/qwik"

export const ListViewDatatHeader = component$(() => {
  return (
    <div class='flex space-x-3 w-full bg-gray-500 mb-2 py-2'>
      <Slot />
    </div>
  )
})