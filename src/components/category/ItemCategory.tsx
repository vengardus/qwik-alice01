import { type PropFunction, component$ } from "@builder.io/qwik";
import { type ICategoryEntity } from "~/domain/entity/category.entity";

export interface ItemCategoryProps {
  category: ICategoryEntity,
  editAction$: PropFunction<(data: any) => void>,
  deleteAction$: PropFunction<(id: number) => void>,
}

export const ItemCategory = component$<ItemCategoryProps>(({
  category,
  editAction$,
  deleteAction$
}) => {
  return (
    <div class='flex space-x-3 w-full'>
      <div class='w-1/12'>{category.id}</div>
      <div class='w-3/12'>{category.name}</div>
      <div class='w-1/12'><button onClick$={() => editAction$(category)}>Editar</button></div>
      <div class='w-1/12'><button onClick$={() => deleteAction$(category.id)}>Eliminar</button></div>
    </div>
  );
});