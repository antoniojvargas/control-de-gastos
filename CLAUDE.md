# Proyecto: control-de-gastos

## Dominio
App de control de gastos personales.
Entidades: Usuario, Categoría, Transacción, Presupuesto.

## Stack
- Backend: Node.js + TypeScript + Fastify + TypeORM + PostgreSQL
- Frontend: React 18 + Vite + Tailwind CSS + Recharts
- Infraestructura: Docker (2 contenedores: `app:3000`, `db:5432`)
- Testing: Jest + Supertest

## Arquitectura
Route → Controller (try/catch) → Service (sin try/catch) → TypeORM Repository
JWT en header `Authorization: Bearer <token>` · `AppError` + `errorHandler` global
Ver detalles: ARCHITECTURE.md

## Frontend
React intermedio-bajo. Componentes funcionales, hooks en `client/src/hooks/`, React Hook Form, sin Redux.
Ver convenciones completas: FRONTEND.md

## Docker
- DB conecta por red interna Docker: `db:5432` — nunca `localhost`
- Env vars inyectadas vía `docker-compose.yml`
- `docker-compose up --build` — levanta desde cero
- `docker-compose down -v` — baja y elimina volúmenes
- `npm run client` — React en puerto 5173 (fuera de Docker)
- `npm test` / `npm run test:watch`

## Convenciones de código
- Async/await siempre, nunca callbacks
- try/catch solo en controllers, nunca en services
- camelCase para variables/funciones · kebab-case para archivos
- Named exports en backend (no default exports)
- Entidades TypeORM en `src/entities/` — una por archivo, propiedades con `!`
- `req.user` se castea explícito: `(req.user as { id: number; email: string })`

## Variables de entorno (.env)
```
DATABASE_HOST=db  DATABASE_PORT=5432  DATABASE_USER=postgres
DATABASE_PASSWORD=postgres  DATABASE_NAME=gastos_db
PORT=3000  NODE_ENV=development  JWT_SECRET=...
```

## Lo que NO hacer
- No usar `var`, solo `const`/`let`
- No instalar dependencias sin consultarme
- No usar `localhost` para la DB desde el backend
- No modificar `.env` o `docker-compose.yml` sin avisar
- No usar Express; el servidor HTTP es Fastify

## Guías de comportamiento
1. **Piensa antes de programar** — expón suposiciones, pregunta si hay ambigüedad
2. **Simplicidad primero** — mínimo código necesario, nada especulativo
3. **Cambios quirúrgicos** — toca solo lo necesario, no "mejores" código adyacente
4. **Orientado a objetivos** — define criterios verificables antes de implementar

Ejemplos de código de cada principio: EXAMPLES.md

## Tareas activas
Ver: TASKS.md
