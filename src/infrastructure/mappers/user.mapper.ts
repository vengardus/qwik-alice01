import type { IUserModel } from "~/infrastructure/data/supabase/models/user.model";
import type { IUserEntity } from "~/domain/entity/user.entity";

export class UserMapper {
    static userEntityFromUserModel(userModel:IUserModel):IUserEntity {
        return userModel as IUserEntity
    }
}