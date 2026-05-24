# Proyecto: control-de-gastos

## Dominio del proyecto
App de control de gastos personales.
Entidades principales: Usuario, Gasto, Categoría, Presupuesto.

## Stack
- Backend: Node.js + TypeScript con Fastify
- Frontend: React + Vite
- DB: PostgreSQL con TypeORM
- Infraestructura: Docker (2 contenedores)
- Testing: Jest + Supertest

## Contenedores Docker
- `app` — Node.js backend, puerto 3000
- `db` — PostgreSQL, puerto 5432

## Estructura del proyecto
project-root/
  src/
    controllers/
    services/
    routes/
    middleware/
    entities/        ← Entidades TypeORM
    data-source.ts   ← Configuración conexión TypeORM
    server.ts        ← Entry point
  client/
    src/
      components/
      hooks/
      pages/
  docker-compose.yml
  Dockerfile
  .env

## Convenciones de código
- Async/await siempre, nunca callbacks
- Manejo de errores con try/catch en controllers, no en services
- Variables y funciones en camelCase
- Archivos en kebab-case
- Exports nombrados, no default exports en backend
- Entidades TypeORM con decoradores, una por archivo en `src/entities/`

## Docker
- El backend se conecta a Postgres usando la red interna de Docker (`db:5432`)
- Nunca usar `localhost` para la DB dentro de los contenedores
- Variables de entorno inyectadas vía `docker-compose.yml`
- Reconstruir imagen con `docker compose up --build` al cambiar dependencias
- El frontend consume la API en http://localhost:3000 (backend expuesto al host)

## Comandos útiles
- `docker compose up --build` — levanta backend + DB desde cero
- `docker compose up` — levanta sin reconstruir
- `docker compose down -v` — baja contenedores y elimina volúmenes
- `docker compose logs -f app` — logs del backend en tiempo real
- `npm run client` — inicia React en puerto 5173 (corre local, fuera de Docker)
- `npm test` — corre tests
- `npm run test:watch` — modo watch

## Variables de entorno (.env)
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gastos_db
PORT=3000
NODE_ENV=development

## Lo que NO hacer
- No usar var, solo const/let
- No instalar dependencias sin consultarme
- No usar localhost para conectar al DB desde el backend
- No modificar archivos de configuración (.env, docker-compose.yml) sin avisar
- No usar Express ni el módulo http nativo; el servidor HTTP es Fastify

---

Guías de comportamiento para reducir errores comunes de programación cometidos por LLMs. Combínalas con instrucciones específicas del proyecto cuando sea necesario.

**Compensación:** Estas guías priorizan la cautela sobre la velocidad. Para tareas triviales, usa tu criterio.

## 1. Piensa Antes de Programar

**No asumas. No ocultes la confusión. Expón las compensaciones y alternativas.**

Antes de implementar:
- Expón tus suposiciones explícitamente. Si tienes dudas, pregunta.
- Si existen múltiples interpretaciones, preséntalas; no elijas una silenciosamente.
- Si existe una solución más simple, dilo. Cuestiona la complejidad innecesaria cuando sea apropiado.
- Si algo no está claro, detente. Explica qué es confuso. Pregunta.

## 2. Simplicidad Primero

**El mínimo código necesario para resolver el problema. Nada especulativo.**

- No agregues funcionalidades más allá de lo solicitado.
- No crees abstracciones para código de un solo uso.
- No agregues "flexibilidad" o "configurabilidad" que no hayan sido solicitadas.
- No implementes manejo de errores para escenarios imposibles.
- Si escribiste 200 líneas y podrían ser 50, reescríbelo.

Pregúntate: "¿Un ingeniero senior diría que esto está sobrecomplicado?" Si la respuesta es sí, simplifícalo.

## 3. Cambios Quirúrgicos

**Toca únicamente lo necesario. Limpia solo el desorden que tú mismo generes.**

Al editar código existente:
- No "mejores" código, comentarios o formato adyacente.
- No refactorices cosas que no están rotas.
- Mantén el estilo existente, incluso si tú lo harías diferente.
- Si detectas código muerto no relacionado, menciónalo, pero no lo elimines.
- En caso de conflicto entre simplicidad y consistencia de estilo, prioriza simplicidad.

Cuando tus cambios generen elementos huérfanos:
- Elimina imports, variables o funciones que TUS cambios hayan dejado sin uso.
- No elimines código muerto preexistente a menos que se solicite explícitamente.

La prueba: Cada línea modificada debe poder relacionarse directamente con la solicitud del usuario.

## 4. Ejecución Orientada a Objetivos

**Define criterios de éxito. Itera hasta verificarlos.**

Convierte las tareas en objetivos verificables:
- “Agregar validación” → “Escribir pruebas para entradas inválidas y hacer que pasen”
- “Corregir el bug” → “Escribir una prueba que lo reproduzca y luego hacer que pase”
- “Refactorizar X” → “Asegurar que las pruebas pasen antes y después”

Para tareas de varios pasos, define un plan breve:
```
1. [Paso] → verificar: [comprobación]
2. [Paso] → verificar: [comprobación]
3. [Paso] → verificar: [comprobación]
```

Criterios de éxito sólidos permiten iterar de forma autónoma. Criterios débiles (“hacer que funcione”) requieren aclaraciones constantes.

---

**Estas guías están funcionando si:** hay menos cambios innecesarios en los diffs, menos reescrituras por sobrecomplicación y las preguntas aclaratorias ocurren antes de implementar, en lugar de después de cometer errores.