# Arquitectura

## Patrón general
API REST con separación en capas: Route → Controller → Service → Model

## Flujo de una request
1. Route valida schema (Zod)
2. Controller orquesta, maneja HTTP
3. Service contiene lógica de negocio
4. Model/Prisma habla con DB

## Autenticación
JWT en header Authorization: Bearer <token>
Middleware `authMiddleware` protege rutas privadas

## Manejo de errores
Clase AppError centralizada, capturada por errorHandler middleware global

## Variables de entorno relevantes
DATABASE_URL, JWT_SECRET, PORT, NODE_ENV