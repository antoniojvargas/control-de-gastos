import "reflect-metadata";
import Fastify from "fastify";
import fjwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { AppDataSource } from "../data-source";
import { errorHandler } from "../middleware/error-handler";
import { authRoutes } from "../routes/auth-routes";

let app: ReturnType<typeof Fastify>;

beforeAll(async () => {
  process.env.DATABASE_HOST = "localhost";
  process.env.DATABASE_PORT = "5432";
  process.env.DATABASE_USER = "postgres";
  process.env.DATABASE_PASSWORD = "postgres";
  process.env.DATABASE_NAME = "gastos_db";
  process.env.JWT_SECRET = "test_secret_minimum_32_chars_long";

  app = Fastify();
  await app.register(cors);
  await app.register(fjwt, { secret: process.env.JWT_SECRET });
  app.setErrorHandler(errorHandler);
  await app.register(authRoutes, { prefix: "/api/auth" });

  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
  await app.close();
});

describe("Auth endpoints", () => {
  const email = `test_${Date.now()}@test.com`;

  it("POST /api/auth/registro → 201", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/registro",
      payload: { email, password: "123456", nombre: "Test User" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.email).toBe(email);
  });

  it("POST /api/auth/registro con email duplicado → 409", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/registro",
      payload: { email, password: "123456", nombre: "Test User" },
    });
    expect(res.statusCode).toBe(409);
  });

  it("POST /api/auth/login con contraseña incorrecta → 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email, password: "wrongpassword" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/auth/login correcto → token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email, password: "123456" },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
  });
});
