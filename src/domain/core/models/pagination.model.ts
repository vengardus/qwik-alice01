import { AppConfig } from "~/domain/app.config"

interface ICalculateNewOffset {
    typeAction: string,
    offset: number,
    count: number,
    limit: number
}

export class Pagination {
    static calculateNewOffset({ typeAction, offset, count, limit }: ICalculateNewOffset)
        : number {
        if (typeAction == AppConfig.PAGINATION.prev) offset -= limit
        else offset += limit
        if ((offset + 1) > count) offset = count - 1
        if (offset < 1) offset = 0
        return offset
    }
}