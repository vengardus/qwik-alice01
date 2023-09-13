import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { PAGINATION } from "~/business/general";
import type { IPagination } from "~/interfaces/general";

interface IProps {
  pagination: IPagination,
  url: string // ejm: '/products'
}

export const Pagination = component$((props:IProps) => {
  const nav = useNavigate();

  const changePage = $((action: string) => {
    if (action == PAGINATION.next)
      nav(`${props.url}?iniRow=${props.pagination.iniRow + PAGINATION.limit}`)
    else {  
      // page prev
      props.pagination.iniRow -= PAGINATION.limit;
      if (props.pagination.iniRow < 0) props.pagination.iniRow = 0;
      nav(`${props.url}?iniRow=${props.pagination.iniRow}`)
    }
  })
  
  return (
    <div class='flex flex-col space-y-3 pb-3'>
      <div class='flex justify-start space-x-2'>
        <span>
          {((props.pagination.iniRow + PAGINATION.limit) > props.pagination.count)
            ? props.pagination.count
            : props.pagination.iniRow + PAGINATION.limit
          }
        </span>
        <span>de</span>
        <span>{props.pagination.count}</span>
      </div>

      <div class='flex justify-center space-x-5'>
        <button onClick$={() => changePage(PAGINATION.prev)}
          disabled={(props.pagination.iniRow <= 0) ? true : false}>
          Anteriores
        </button>
        <button onClick$={() => changePage(PAGINATION.next)}
          disabled={(props.pagination.iniRow + PAGINATION.limit >= props.pagination.count) ? true : false}>
          Siguientes
        </button>
      </div>
    </div>
  )
});