
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export const registerSwagger = async (app: FastifyInstance) => {

    await app.register(fastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
            title: 'Todo List API',
            description: 'API для управления задачами и списками дел',
            version: '1.0.0',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
            },
            servers: [
            {
                url: 'http://localhost:3000',
                description: 'Сервер разработки'
            }
            ],
            tags: [
            { name: 'TodoLists', description: 'Управление списками задач' },
            { name: 'Todos', description: 'Управление задачами' },
            { name: 'Comments', description: 'Управление комментариями' }
            ],
            components: {
            securitySchemes: {
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Введите JWT токен в формате: Bearer <token>'
                }
            }
            },
            security: [{ bearerAuth: [] }]
        }
    });

    await app.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
            persistAuthorization: true // Сохраняет авторизацию при обновлении страницы
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
    });
}

export const addSchemas = (app: FastifyInstance) => {
    app.addSchema({
        $id: "Error",
        type: 'object',
        properties: {
            statusCode: { type: 'integer', examples: [400] },
            error: { type: 'string', examples: ['Bad Request'] },
            message: { type: 'string', examples: ['Invalid input data'] }
        }
    })

    app.addSchema({
        $id: "TodoList",
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', examples: ['123e4567-e89b-12d3-a456-426614174000'] },
            title: { type: 'string', examples: ['Мой список дел'] },
            ownerId: { type: 'string', format: 'uuid', examples: ['123e4567-e89b-12d3-a456-426614174001'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    })

    app.addSchema({
        $id: "Todo",
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', examples: ['Купить продукты'] },
            description: { type: 'string', examples: ['Молоко, хлеб, яйца'] },
            completed: { type: 'boolean', examples: [false] },
            todoListId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    })

    app.addSchema({
        $id: "Comment",
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            text: { type: 'string', examples: ['Отличная задача!'] },
            todoId: { type: 'string', format: 'uuid' },
            authorId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    })
}