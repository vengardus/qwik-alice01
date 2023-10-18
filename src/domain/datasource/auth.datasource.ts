import { type ILoginUserDto } from "../dtos/auth.dto";
import type { IRegisterUserDto } from "../dtos/user.dto";
import { type IUserEntity } from "../entity/user.entity";


export abstract class AuthDatasource {
    abstract login(loginUserDto: ILoginUserDto): Promise<IUserEntity | null>
    abstract registerUser(registerUserDto: IRegisterUserDto): Promise<[string|undefined, IUserEntity | null]>
}