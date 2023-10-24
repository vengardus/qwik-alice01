import { component$, $ } from "@builder.io/qwik";
import { type IItemListViewProps } from "~/domain/core/interfaces/listview.interface";
import { type IProductEntity } from "~/domain/entity/product.entity";


export const ItemListView = component$<IItemListViewProps<IProductEntity>>(({
  item,
  editAction$,
  deleteAction$
}) => {
  const editAction = $((item:IProductEntity) => {
    editAction$(item)
  })
  return (
    <div class='flex space-x-3 w-full'>
      <div class='w-1/12'>{item.id}</div>
      <div class='w-3/12'>{item.name}</div>
      <div class='w-3/12'>{item.description}</div>
      <div class='w-2/12'>{item.price}</div>
      <div class='w-1/12'>{item.currency}</div>
      <div class='w-1/12'><button onClick$={() => editAction(item)} class="btn">Editar</button></div>
      <div class='w-1/12'><button onClick$={() => deleteAction$(item.id)} class="btn">Eliminar</button></div>
    </div>
  );
});