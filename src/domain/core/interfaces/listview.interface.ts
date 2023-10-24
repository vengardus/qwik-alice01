import { type PropFunction } from "@builder.io/qwik";

export interface ListViewProps <T, U>{
    dataList: T,
    insertAction$: PropFunction<() => void>,
    editAction$: PropFunction<(data: U) => void>,
    deleteAction$: PropFunction<(id: number) => void>,
    paginationAction$: PropFunction<(typeAction: string) => void>,
}

export interface IItemListViewProps <T>{
    item: T,
    editAction$: PropFunction<(data: T) => void>,
    deleteAction$: PropFunction<(id: number) => void>,
  }
  