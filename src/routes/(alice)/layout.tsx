import { Slot, component$, createContextId, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import Navbar from '~/components/shared/navbar/Navbar';
import type { IUserEntity } from '~/domain/entity/user.entity';
import { AuthMiddleware } from '~/presentation/middlewares/auth.middleware';

interface IAppContext {
  isAuth: boolean,
  userEntity: IUserEntity | null
}
export const appContext = createContextId<IAppContext>('appContext');

export const useCheckAuth = routeLoader$(async (requestEvent) => {
  console.log('chekAUTH layout (alice)')
  const [messageError, userEntity] = await AuthMiddleware.verifyJWT(requestEvent)
  if (!userEntity) {
    console.log('Error::',messageError)
    //requestEvent.redirect(302, '/')
    return {
      success: false
    }
  }
  console.log('access:Userentity:', userEntity.uid, userEntity.username)
  return {
    success: true,
    userEntity
  }
})


export default component$(() => {
  const dataAppContext = useStore<IAppContext>({ isAuth: false, userEntity: null });
  useContextProvider(appContext, dataAppContext);

  const checkAuth = useCheckAuth()
  
  useTask$(async({track}) => {
    track(()=>checkAuth.value)
    console.log('usetask')
    if (checkAuth.value.success) {
      console.log('Auorizado!!!')
      dataAppContext.isAuth = true
      dataAppContext.userEntity = checkAuth.value.userEntity!
    }
  })

  return (
    <>
      <Navbar />
      <main class='flex flex-col relative top-[58px] z-0 px-4'>
        <Slot />
      </main>
    </>
  )
});