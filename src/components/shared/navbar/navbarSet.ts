export interface IMenuOption {
    name: string,
    href: string,
    title: string,
    description: string,
    detail: string,
    image: string,
    isProject: boolean,
    childs?: IMenuOptionChlid[]
  }
  
  interface IMenuOptionChlid {
    title: string,
    href: string
  }
  
  export const navigationMenu:IMenuOption[] = [
    {
      name: 'catalogo',
      href: '',
      title: 'Catálogo',
      description: 'Listado de catálogos',
      detail:'',
      image:'',
      isProject:false,
      childs: [
        {
          title:'Productos',
          href: '/product'
        },
        {
          title:'Categorías',
          href: '/category'
        },
      ]
    },
    {
      name: 'SpaceX',
      href: '/product',
      title: 'Products 2',
      description: 'Listado de Lanzamientos de SpaceX',
      detail:'Obtiene datos de su Api pública.',
      image:'spacex4.jpg',
      isProject:true,
    },
    {
      name: 'EFRTienda',
      href: '/efrtienda',
      title: 'EFRTienda',
      description: 'Sitio Web de venta de equipos biométricos y captura de datos.',
      detail:'Obtiene datos desde Supabase',
      image:'biometria.jpg',
      isProject:true
    },
    {
      name: 'Next.js 13 Proj1',
      href: 'https://nextjs13-firstproject.vercel.app/',
      title: 'Proyecto Ejm Next.js',
      description: 'Primer proyecto con Next.js 13',
      detail:'Jugando con Next.js',
      image:'nextjs-proj01.png',
      isProject:true
    },
    // {
    //   name: 'Counter',
    //   href: '/counter',
    //   title: 'Counter sample',
    //   description: 'Counter con contexto',
    //   detail:'Prueba de Comtext',
    //   image:'counter.jpg',
    //   isProject:true
    // },
    // {
    //   name: 'Tasks',
    //   href: '/tasks',
    //   title: 'Tasks',
    //   description: 'Registro de tareas',
    //   detail:'CRUD tareas almacenadas en el localStorage.',
    //   image:'tasks3.jpg',
    //   isProject:true
    // },
    // {
    //   name: 'Tasks-Api',
    //   href: '/tasksapi',
    //   title: 'Tasks fetch Api',
    //   description: 'Registro de tareas llamando Api',
    //   detail:'Utiliza api de la app django-crud-api (repositorio). Modo local por ahora, pendiente subir a hosting app Django',
    //   image:'tasks.png',
    //   isProject:true
    // },
    // {
    //   name: 'EFR-Tienda',
    //   href: '/efr-tienda',
    //   title: 'EFR-Tienda',
    //   description: 'Sitio Web de venta de equipos biométricos y captura de datos.',
    //   detail:'Utilizará api creada con Strapi (strapi-demo), estará alojada en Render.com',
    //   image:'biometria.jpg',
    //   isProject:true
    // },
    // {
    //   name: 'About',
    //   href: '/about',
    //   isProject:false
    // },
  ]