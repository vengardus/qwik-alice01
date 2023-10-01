# Project Qwik

## Crear proyecto

```pwd
pnpm create qwik@latest
cd <project-name>
pnpm install
pnpm start
```

## Instalar integraciones

```pwd
pnpm run qwik add prisma
pnpm run qwik add tailwind
pnpm run qwik add auth
// add 'optimizeDeps: { include: ['@auth/core'] }' en vite.config.ts

pnpm add @supabase/supabase-js supabase-auth-helpers-qwik

pnpm add csvtojson
```

## Memorex

- UseTask$ se ejecuta antes del renderizado
- Se debe evitar en lo posible useVisibleTask
- Server$ actua como una función que corre en el servidor.
- Se puede tener acceso al RequestEvent y sus metodos en server$ mediante this.

