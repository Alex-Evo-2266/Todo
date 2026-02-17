// src/hooks/authPrivilege.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { splitPrivilege } from "../utils/splitPrivilege.js";

export function authPrivilege(required: string) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const headers = req.headers as any;

      const userId = headers["x-user-id"];
      const privilegeRaw = headers["x-user-privilege"];

      if (!userId || !privilegeRaw) {
        return reply.code(400).send({ message: "invalid auth data" });
      }

      const privileges = splitPrivilege(privilegeRaw);

      if (!privileges.includes(required)) {
        return reply.code(403).send({ message: "invalid privilege" });
      }

      req.user = {
        id: userId,
        role: headers["x-user-role"],
        privileges,
      };
    } catch (e) {
      req.log.warn(e, "auth privilege error");
      return reply.code(400).send({ message: "invalid data" });
    }
  };
}
