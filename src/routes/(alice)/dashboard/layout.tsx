import { Slot, component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';


export const useCheckAuth = routeLoader$(async (requestEvent) => {
    console.log('checkAuth')
    const jwt = requestEvent.cookie.get('app-token')
    console.log(jwt, (jwt?.value == 'mytoken'))
    if (!(jwt && (jwt.value == 'mytoken')))
        requestEvent.redirect(302, '/login')
})

export default component$(() => {
    return (
        <>
            <Slot />
        </>
    )
});