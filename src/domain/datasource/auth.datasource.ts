import { type ILoginUserDto } from "../dtos/auth.dto";
import { type IUserEntity } from "../entity/user.entity";

export abstract class AuthDatasource {
    abstract login(loginUserDto: ILoginUserDto): Promise<IUserEntity | null>
}