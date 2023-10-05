import { type PropFunction, component$ } from "@builder.io/qwik";
import { AppConfig } from "~/domain/app.config";

export interface ListViewFooterProps {
    paginationAction$: PropFunction<(typeAction: string) => void>,
    pagination: {
        offset: number,
        count: number
    },
}

export const ListViewFooter = component$<ListViewFooterProps>(({
    paginationAction$,
    pagination
}) => {
    return (
        <div class='flex justify-center items-center space-x-5 mt-3'>
            <div>Regs: {
                ((pagination.offset + AppConfig.PAGINATION.limit) > pagination.count)
                    ? pagination.count
                    : pagination.offset + AppConfig.PAGINATION.limit
            } de {pagination.count}
            </div>

            <button onClick$={() => paginationAction$(AppConfig.PAGINATION.prev)}
                disabled={(pagination.offset <= 0) ? true : false}>
                Anterior
            </button>

            <button onClick$={() => paginationAction$(AppConfig.PAGINATION.next)}
                disabled={(pagination.offset + AppConfig.PAGINATION.limit >= pagination.count) ? true : false}>
                Siguiente
            </button>
        </div>
    );
});