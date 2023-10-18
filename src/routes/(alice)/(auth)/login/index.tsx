import { component$, useStylesScoped$} from '@builder.io/qwik';
import { Form, routeAction$, zod$, z, Link } from '@builder.io/qwik-city';
import styles from './login.css?inline';
import { AuthController } from '~/presentation/controllers/auth.controller';


export const useLoginAction = routeAction$(async (data, requestEvent) => {
    const oAuthController = new AuthController(requestEvent)
    const userEntity = await oAuthController.loginUser(data)
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
    const loginAction = useLoginAction()
    useStylesScoped$(styles);

    return (
        <Form action={loginAction}
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
                <button>Ingresar</button>
            </div>

            {loginAction.isRunning && <div>Validando, espere un momento...</div>}
            {!loginAction.value?.success && loginAction.value?.message && <div class='text-red-600'>{loginAction.value.message}</div>}

        <div>
            <Link href="/signup">Crear cuenta</Link>
        </div>
        </Form>
    )
});