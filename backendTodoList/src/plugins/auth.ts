// src/plugins/auth.ts
import fp from "fastify-plugin";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      role?: string;
      privileges: string[];
    };
  }
}

export default fp(async (app) => {
  app.decorateRequest("user", undefined);
});
