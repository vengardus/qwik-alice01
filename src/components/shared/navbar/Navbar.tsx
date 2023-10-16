import { component$, useSignal, $, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Image } from '@unpic/qwik';
import { type IMenuOption, navigationMenu as navMenu } from './navbarSet';
import { appContext } from '~/routes/(alice)/layout';

interface iProps {
    navigationMenu?: IMenuOption[],
    isFixed?: boolean,
    colorClass?: string,
    logo?: string
}

const positionFixedClass = 'fixed top-0 left-0 right-0 z-40 h-[58px]'

export default component$(({
    navigationMenu = navMenu,
    isFixed = true,
    colorClass = 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    logo = "/assets/img/logo-gardus.png"
    //logo = "logo-gardus.png"
}: iProps) => {
    const mainMenu = useSignal(false)
    const dataAppContext = useContext(appContext);

    const changeDropdownMenu = $((submenu: string) => {
        const elementsDropDown = document.getElementsByClassName('dropNavBar');
        for (let i = 0; i < elementsDropDown.length; i++) {
            if (elementsDropDown[i].id === submenu)
                elementsDropDown[i].classList.toggle("hidden");
            else {
                elementsDropDown[i].classList.remove("block");
                elementsDropDown[i].classList.add("hidden");
            }
        }
        //const element = document.getElementById(submenu);
        //element?.classList.toggle("hidden");
    })


    const changeMainMenu = $(() => {
        mainMenu.value = !mainMenu.value
    })


    return (
        <nav class={`w-full ${colorClass} ${!isFixed ? '' : positionFixedClass}`}>
            <div class="flex flex-wrap items-center justify-between mx-1auto pl-3 pr-7 h-full">
                {/* Logo */}
                <div>
                    {dataAppContext.isAuth ? 'Auth!!!' : 'Not Auth'}
                </div>

                <div class="w-3/12 h-full md:w-1/12"> {
                    (logo) &&
                    <Link href="/" class="flex w-full h-full">
                        <Image src={logo} class="" alt="Ismytv Logo" width={120} height={20} />
                    </Link>
                }
                </div>

                {/* Icon Menu Small Screen */}
                <button
                    aria-controls="navbar-dropdown" aria-expanded="false"
                    class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    data-collapse-toggle="navbar-dropdown"
                    onClick$={() => { changeMainMenu() }}
                    type="button" >
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                </button>

                {/* Main menu */}
                <div id="navbar-dropdown"
                    class={`${mainMenu.value ? 'block' : 'hidden'} w-full md:block md:w-auto pr-2`} >

                    {/* Menu Items */}
                    <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-700"> {
                        navigationMenu
                            .filter(
                                item => (item.isAuth === undefined
                                    || (item.isAuth && dataAppContext.isAuth)
                                    || (!item.isAuth && !dataAppContext.isAuth)))
                            .map((item) => {
                                return (!item.childs) ?
                                    <li key={item.name}>
                                        {/* item simple */}
                                        <Link
                                            href={item.href}
                                            class="block py-2 pl-3 pr-4 text-gray-800 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                            onClick$={() => changeMainMenu()}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                    :
                                    <li key={item.name}>
                                        {/* item con subitems */}
                                        <button id="dropdownNavbarLink"
                                            onClick$={() => {
                                                changeDropdownMenu(`dropdownNavbar-${item.name}`);
                                                // changeMainMenu();
                                            }}
                                            data-dropdown-toggle={`dropdownNavbar-${item.name}`}
                                            class="flex items-center justify-between w-full py-2 pl-3 pr-4 text-gray-800 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                                            {item.title}
                                            <svg class="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        </button>

                                        <div key={`${item.title}-${'child'}`}
                                            id={`dropdownNavbar-${item.name}`}
                                            class={`dropNavBar z-10 absolute hidden font-normal bg-white divide-y divide-gray-100 shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                                            <ul class="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton"> {
                                                item.childs.map((subitem) => (
                                                    <li key={subitem.title}>
                                                        <Link
                                                            onClick$={() => {
                                                                changeDropdownMenu(`dropdownNavbar-${item.name}`);
                                                                changeMainMenu();
                                                            }}
                                                            href={subitem.href}
                                                            class="block px-0 py-2 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            {subitem.title}
                                                        </Link>
                                                    </li>

                                                ))
                                            }
                                            </ul>
                                        </div>
                                    </li>
                            })
                    }
                    </ul>
                </div>
            </div>
        </nav>
    )
});