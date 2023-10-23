import { type IEntity } from "../core/interfaces/entity.interface"

export interface ICategoryEntity extends IEntity {
  // id: number
  name: string
  created_at: any
  update_at: any
}
