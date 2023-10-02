import { type PropFunction, component$ } from "@builder.io/qwik";
import { type IProductEntity } from "~/domain/entity/product.entity";

export interface ItemProductProps {
  product: IProductEntity,
  editAction$: PropFunction<(data: any) => void>,
  deleteAction$: PropFunction<(id: number) => void>,
}

export const ItemProduct = component$<ItemProductProps>(({
  product,
  editAction$,
  deleteAction$
}) => {
  return (
    <div class='flex space-x-3 w-full'>
      <div class='w-1/12'>{product.id}</div>
      <div class='w-3/12'>{product.name}</div>
      <div class='w-3/12'>{product.description}</div>
      <div class='w-2/12'>{product.price}</div>
      <div class='w-1/12'>{product.currency}</div>
      <div class='w-1/12'><button onClick$={() => editAction$(product)}>Edit</button></div>
      <div class='w-1/12'><button onClick$={() => deleteAction$(product.id)}>Delete</button></div>
    </div>
  );
});