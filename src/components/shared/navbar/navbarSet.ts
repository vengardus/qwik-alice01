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
      name: 'dashboard',
      href: '/dashboard',
      title: 'Dashboard',
      description: '',
      detail:'',
      image:'',
      isProject:false
    },
    {
      name: 'login',
      href: '/login',
      title: 'Login',
      description: '',
      detail:'',
      image:'',
      isProject:false
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