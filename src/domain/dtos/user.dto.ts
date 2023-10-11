import { type IUserEntity } from "~/domain/entity/user.entity"
import { type IDataResponse } from "./app.dto"


export interface IListUserDto extends IDataResponse {
  data: IUserEntity[] | null
}

export interface IRegisterUserDto {
  username: string
  password: string
  profileType: string
  email: string
}
