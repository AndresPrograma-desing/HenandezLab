# HernandezLab-WEB

Sistema de gestión para laboratorio clínico HernandezLab: usuarios, sucursales, inventario de reactivos, proveedores y solicitudes de exámenes. Reemplaza el backend anterior en Express/Postgres — ahora es una SPA en React que habla directamente con Supabase (Postgres + Auth + RLS).

## Stack

- **React 18** + **Vite 5**
- **MUI 5** + **Emotion** para estilos base, con [anteriority-ui](../AnteriorityUI.md) como librería de componentes propia
- **React Router 6**
- **Supabase** (`@supabase/supabase-js`) como backend: base de datos, autenticación y políticas RLS por rol
- **date-fns**, **lucide-react**

## Requisitos

- Node.js 18+
- pnpm (el proyecto usa `pnpm-lock.yaml` y `pnpm-workspace.yaml`)
- Un proyecto de Supabase con el esquema de [`../SQL/schema.sql`](../SQL/schema.sql) aplicado

## Puesta en marcha

```bash
pnpm install
cp .env.example .env   # completar con las credenciales de tu proyecto Supabase
pnpm dev                # http://localhost:3006
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) del proyecto Supabase |

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo (Vite, puerto 3006) |
| `pnpm build` | Build de producción |
| `pnpm preview` | Sirve el build de producción localmente |
| `pnpm lint` | ESLint sobre `.js`/`.jsx` |
| `pnpm fix:import-case` | Corrige el casing de imports (ver `scripts/fix-import-case.mjs`) |

## Roles del sistema

- **Administrativo**: acceso total (Usuarios, Sucursales, Inventario, Proveedores, Solicitudes).
- **Recepción**: acceso limitado a Solicitudes e Inventario, acotado a su sucursal asignada.

El control de acceso se aplica tanto en el cliente (`RoleGate`, `ProtectedRoute`) como en la base de datos vía políticas RLS de Supabase.

## Estructura del proyecto

```
src/
  components/
    common/       # componentes compartidos entre features
    layout/        # DashboardLayout, ProtectedRoute, RoleGate
  constants/       # TEXTS (strings de UI), ROUTES, etc.
  features/
    auth/          # login
    dashboard/
    inventario/
    proveedores/
    solicitudes/
    sucursales/
    usuarios/
  hooks/           # useAuth, useSucursalActiva, ...
  lib/
    supabaseClient.js
  styles/          # theme.js / theme.css (tema verde del laboratorio)
  utils/
docs/
  historias-usuario.md   # historias de usuario por módulo y rol
  diagrama-er.md          # diagrama entidad-relación
```

El esquema SQL (tablas, triggers, políticas RLS) vive en [`../SQL/`](../SQL/) a nivel de repositorio, no dentro de este paquete.

## Convenciones del proyecto

- **Sin textos hardcodeados**: todo string de UI va en `src/constants/texts.js` (`TEXTS`).
- **CSS modular**: nada de `style={{}}` inline — cada componente tiene su `X.module.css` hermano.
- Componentes de `anteriority-ui` que requieran `id` único (p. ej. `Selector`) deben recibir uno explícito para evitar colisiones cuando hay varias instancias en pantalla.
- Tema del sistema en verde (`src/styles/theme.js` + `theme.css`), no el azul por defecto de la librería.

## Documentación adicional

- [Historias de usuario](docs/historias-usuario.md)
- [Diagrama entidad-relación](docs/diagrama-er.md)
- [Esquema SQL con RLS](../SQL/schema.sql)
