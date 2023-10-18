import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { AuthController } from "~/presentation/controllers/auth.controller";

export const useLogout = routeLoader$(async (requestEvent) => {
    //requestEvent.cookie.delete(AppConfig.KEYS.cokieNameJwt, { path: '/' })
    const oController = new AuthController(requestEvent)
    await oController.logout()
    requestEvent.redirect(302, '/')

})

export default component$(() => {

    return <div>Logout</div>
});