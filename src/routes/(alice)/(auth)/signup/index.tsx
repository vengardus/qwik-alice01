import { component$, useStylesScoped$} from '@builder.io/qwik';
import { Form, routeAction$, zod$, z, Link } from '@builder.io/qwik-city';
import { AuthController } from '~/presentation/controllers/auth.controller';
import { type IRegisterUserDto } from '~/domain/dtos/user.dto';
import styles from '../login/login.css?inline';


export const useRegisterUserAction = routeAction$(async (data, requestEvent) => {
    console.log('useRegisterUser')
    const oAuthController = new AuthController(requestEvent)
    const registerUser:IRegisterUserDto = {
        username:data.username,
        password:data.password,
        role:'user',
        email:''
    }
    const userEntity = await oAuthController.registerUser(registerUser)
    if (!userEntity)
        return {
            success: false,
            message: oAuthController.message
        }
    requestEvent.redirect(302, '/')
    return {
        success: true,
        userEntity
    }
}, zod$({
    username: z.string().min(4, 'Mínimo 4 caracteres'),
    password: z.string().min(4, 'Mínimo 4 caracteres')
})
)


export default component$(() => {
    const registerUserAction = useRegisterUserAction()
    useStylesScoped$(styles);

    return (
        <Form action={registerUserAction}
            class="login-form"
        >
            <div class="relative">
                <input name="username" type="text" placeholder="Username" />
                <label for="username">Username</label>
            </div>
            <div class="relative">
                <input id="password" name="password" type="password" placeholder="Password" />
                <label for="password">Password</label>
            </div>
            <div class="relative">
                <button>Regsitrar</button>
            </div>

            {registerUserAction.isRunning && <div>Validando, espere un momento...</div>}
            {!registerUserAction.value?.success && registerUserAction.value?.message && <div class='text-red-600'>{registerUserAction.value.message}</div>}

            <div>
                <Link href="/login">Ya tengo una cuenta</Link>
            </div>
        </Form>
    )
});