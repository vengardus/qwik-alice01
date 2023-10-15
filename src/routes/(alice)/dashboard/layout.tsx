import { Slot, component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { AuthMiddleware } from '~/presentation/middlewares/auth.middleware';


export const useCheckAuth = routeLoader$(async (requestEvent) => {
    const payload = await AuthMiddleware.verifyJWT(requestEvent) 
    if ( !payload ) {
        requestEvent.redirect(302, '/login')
        return
    }
    const {id} = payload as {id:string}
    console.log('Access:', id!)
})

export default component$(() => {
    return (
        <>
            <Slot />
        </>
    )
});