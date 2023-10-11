import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Form, routeAction$, zod$, z } from '@builder.io/qwik-city';
import styles from './login.css?inline';
import { AuthController } from '~/controllers/auth.controller';

// const validateUser = (data:JSONObject) => {
//     const { username, password } = data
//     console.log(username, password)
//     if (username == 'ismytv@gmail.com' && password == '1234') return true
//     return false
// }

export const useLoginAction = routeAction$(async (data, requestEvent) => {
    const oAuthController = new AuthController(requestEvent)
    const response = await oAuthController.login(data)
    if (!response.success)
        return {
            success: false,
            message: response.message
        }
    //requestEvent.redirect(302, '/')
    return {
        success: true,
        user:response.user
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
        <Form action={loginAction} class="login-form">
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


            <code>
                {JSON.stringify(loginAction.value, undefined, 2)}
            </code>
        </Form>
    )
});