import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {addSchemas, registerSwagger} from "@src/openAPISchemas.js"
import { route } from "./routes/router.js";

async function start() {

    const app = Fastify({ logger: true });
    const DB_HOST = process.env.DB_HOST
    const DB_DATABASE = process.env.DB_DATABASE
    const DB_USER = process.env.DB_USER
    const DB_PASSWORD = process.env.DB_PASSWORD
    const DATABASE_URL=`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_DATABASE}`

    const adapter = new PrismaPg({ connectionString: DATABASE_URL })
    const prisma = new PrismaClient({ adapter })
    app.decorate('prisma', prisma);
    // Регистрируем Swagger
    await registerSwagger(app)
    addSchemas(app)

    app.register(route, {prefix: '/api-todo'})

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📚 Swagger documentation available at http://localhost:3000/documentation');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();