import { type PropFunction, component$ } from "@builder.io/qwik";
import { AppConfig } from "~/domain/app.config";

export interface ListViewFooterProps {
  paginationAction$: PropFunction<(typeAction: string) => void>,
  paginationStore: {
    offset: number,
    count: number
  },
}

export const ListViewFooter = component$<ListViewFooterProps>(({
  paginationAction$,
  paginationStore
}) => {
  return (
    <div class='flex justify-center items-center space-x-5 mt-3'>
      <div>Regs: {
        ((paginationStore.offset + AppConfig.PAGINATION.limit) > paginationStore.count)
          ? paginationStore.count
          : paginationStore.offset + AppConfig.PAGINATION.limit
      } de {paginationStore.count}
      </div>

      <button onClick$={() => paginationAction$(AppConfig.PAGINATION.prev)}
        disabled={(paginationStore.offset <= 0) ? true : false}>
        Anteriores
      </button>
      <button onClick$={() => paginationAction$(AppConfig.PAGINATION.next)}
        disabled={(paginationStore.offset + AppConfig.PAGINATION.limit >= paginationStore.count) ? true : false}>
        Siguientes
      </button>
    </div>
  );
});