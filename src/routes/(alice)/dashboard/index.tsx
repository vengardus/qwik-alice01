import { component$, useContext, useTask$ } from '@builder.io/qwik';
import { appContext } from '../layout';

export default component$(() => {
    const dataAppContext = useContext(appContext);
    useTask$(()=>{
        console.log('dashboard-context', dataAppContext)
    })

    return (
        <>
            <h2>Dashboard</h2>
            {dataAppContext.isAuth? 'AUHT':'NOT AUTH'}
            <p>Pagina privada</p>
        </>
    )
});