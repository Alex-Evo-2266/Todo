import { authPrivilege } from "@root/hooks/authPrivilege.js";
import { FastifyInstance } from "fastify";
import { getAccessListSchema, grantAccessSchema, revokeAccessSchema } from "./openApiSchemas/user.js";

export function routeAccess(app: FastifyInstance)
{   
    app.post<{ 
        Params: { id: string }, 
        Body: { userId: string } 
    }>(
    "/todolists/:id/access",
    {
        preHandler: authPrivilege("todolist:share"),
        schema: grantAccessSchema
    },
    async (req, reply) => {
        try {
        const { id } = req.params;
        const { userId } = req.body;
        const currentUserId = req.user!.id;

        // Проверяем, что текущий пользователь — владелец
        const todoList = await app.prisma.todoList.findUnique({
            where: { id },
        });

        if (!todoList || todoList.ownerId !== currentUserId) {
            return reply.status(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "Only owner can manage access",
            });
        }

        // Создаём доступ (или игнорируем если уже есть)
        const access = await app.prisma.todoListAccess.upsert({
            where: {
                todoListId_userId: {
                    todoListId: id,
                    userId,
                },
            },
            update: {},
            create: {
                todoListId: id,
                userId,
            },
        });

        return reply.status(200).send(access);
        } catch (error) {
        req.log.error(error);
        return reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Failed to grant access",
        });
        }
    }
    );

    app.delete<{ Params: { id: string; userId: string } }>(
    "/todolists/:id/access/:userId",
    {
        preHandler: authPrivilege("todolist:share"),
        schema: revokeAccessSchema
    },
    async (req, reply) => {
        try {
        const { id, userId } = req.params;
        const currentUserId = req.user!.id;

        const todoList = await app.prisma.todoList.findUnique({
            where: { id },
        });

        if (!todoList || todoList.ownerId !== currentUserId) {
            return reply.status(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "Only owner can manage access",
            });
        }

        await app.prisma.todoListAccess.deleteMany({
            where: {
            todoListId: id,
            userId,
            },
        });

        return reply.status(204).send();
        } catch (error) {
        req.log.error(error);
        return reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Failed to revoke access",
        });
        }
    }
    );

    app.get<{ Params: { id: string } }>(
    "/todolists/:id/access",
    {
        preHandler: authPrivilege("todolist:read"),
        schema: getAccessListSchema
    },
    async (req, reply) => {
        try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Проверка доступа (владелец или есть доступ)
        const todoList = await app.prisma.todoList.findFirst({
            where: {
            id,
            OR: [
                { ownerId: userId },
                { access: { some: { userId } } },
            ],
            },
        });

        if (!todoList) {
            return reply.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Todo list not found or access denied",
            });
        }

        const accessList = await app.prisma.todoListAccess.findMany({
            where: { todoListId: id },
        });

        return reply.send(accessList);
        } catch (error) {
        req.log.error(error);
        return reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Failed to fetch access list",
        });
        }
    }
    );
}