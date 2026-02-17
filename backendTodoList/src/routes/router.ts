import { authPrivilege } from "@root/hooks/authPrivilege.js";
import { FastifyInstance } from "fastify";


export function route(app: FastifyInstance)
{
    /**
     * Create TodoList
     * owner = current user
     */
    app.post<{ Body: { title: string } }>(
    "/todolists",
    {
        preHandler: authPrivilege("todolist:create"),
        schema: {
        tags: ['TodoLists'],
        summary: 'Создать новый список задач',
        description: 'Создает новый список задач для текущего пользователя',
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['title'],
            properties: {
            title: {
                type: 'string',
                description: 'Название списка задач',
                minLength: 1,
                maxLength: 100,
                examples: ['Проект по разработке']
            }
            }
        },
        response: {
            200: {
            description: 'Список успешно создан',
            content: {
                'application/json': {
                schema: { $ref: 'TodoList#' }
                }
            }
            },
            400: {
            description: 'Ошибка валидации',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            },
            401: {
            description: 'Не авторизован',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            }
        }
        }
    },
    async (req, reply) => {
        try {
        const userId = req.user!.id;
        const todoList = await app.prisma.todoList.create({
            data: {
            title: req.body.title,
            ownerId: userId,
            },
        });
        return reply.status(200).send(todoList);
        } catch (error) {
            console.log(error)
        return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to create todo list' 
        });
        }
    }
    );

    /**
     * Get TodoLists where user is owner OR has access
     */
    app.get(
    "/todolists",
    {
        preHandler: authPrivilege("todolist:read"),
        schema: {
        tags: ['TodoLists'],
        summary: 'Получить все списки задач пользователя',
        description: 'Возвращает списки задач, где пользователь является владельцем или имеет доступ',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
            description: 'Список задач успешно получен',
            type: 'array',
            items: { $ref: 'TodoList#' }
            },
            400: {
                description: 'Ошибка получения списка задач',
                content: {
                    'application/json': {
                        schema: { $ref: 'Error#' }
                    }
                }
            },
            401: {
            description: 'Не авторизован',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            }
        }
        }
    },
    async (req, reply) => {
        try {
        const userId = req.user!.id;
        const todoLists = await app.prisma.todoList.findMany({
            where: {
            OR: [
                { ownerId: userId },
                { access: { some: { userId } } },
            ],
            },
        });
        return reply.status(200).send(todoLists);
        } catch (error) {
        return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to fetch todo lists' 
        });
        }
    }
    );

    /**
     * Create Todo in list
     */
    app.post<{ Body: { title: string; description?: string }, Params: { id: string } }>(
    "/todolists/:id/todos",
    {
        preHandler: authPrivilege("todolist:create"),
        schema: {
        tags: ['Todos'],
        summary: 'Создать новую задачу в списке',
        description: 'Создает новую задачу в указанном списке',
        security: [{ bearerAuth: [] }],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID списка задач',
                examples: ['123e4567-e89b-12d3-a456-426614174000']
            }
            }
        },
        body: {
            type: 'object',
            required: ['title'],
            properties: {
            title: {
                type: 'string',
                description: 'Название задачи',
                minLength: 1,
                maxLength: 200,
                examples: ['Написать код']
            },
            description: {
                type: 'string',
                description: 'Подробное описание задачи',
                maxLength: 1000,
                examples: ['Реализовать API для управления задачами']
            }
            }
        },
        response: {
            200: {
            description: 'Задача успешно создана',
            content: {
                'application/json': {
                schema: { $ref: 'Todo#' }
                }
            }
            },
            400: {
            description: 'Ошибка валидации',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            },
            401: {
            description: 'Не авторизован',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            },
            404: {
            description: 'Список не найден',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            }
        }
        }
    },
    async (req, reply) => {
        try {
        // Проверяем существование списка
        const todoList = await app.prisma.todoList.findUnique({
            where: { id: req.params.id }
        });

        if (!todoList) {
            return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Todo list not found'
            });
        }

        const todo = await app.prisma.todo.create({
            data: {
            title: req.body.title,
            description: req.body.description ?? "",
            todoListId: req.params.id,
            },
        });
        return reply.status(200).send(todo);
        } catch (error) {
        return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to create todo' 
        });
        }
    }
    );

    /**
     * Add comment
     */
    app.post<{ Body: { text: string }, Params: { id: string } }>(
    "/todos/:id/comments",
    {
        preHandler: authPrivilege("todolist:comment"),
        schema: {
        tags: ['Comments'],
        summary: 'Добавить комментарий к задаче',
        description: 'Добавляет новый комментарий к указанной задаче',
        security: [{ bearerAuth: [] }],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID задачи',
                examples: ['123e4567-e89b-12d3-a456-426614174002']
            }
            }
        },
        body: {
            type: 'object',
            required: ['text'],
            properties: {
            text: {
                type: 'string',
                description: 'Текст комментария',
                minLength: 1,
                maxLength: 500,
                examples: ['Нужно добавить валидацию']
            }
            }
        },
        response: {
            200: {
            description: 'Комментарий успешно добавлен',
            content: {
                'application/json': {
                schema: { $ref: 'Comment#' }
                }
            }
            },
            400: {
            description: 'Ошибка валидации',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            },
            401: {
            description: 'Не авторизован',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            },
            404: {
            description: 'Задача не найдена',
            content: {
                'application/json': {
                schema: { $ref: 'Error#' }
                }
            }
            }
        }
        }
    },
    async (req, reply) => {
        try {
        // Проверяем существование задачи
        const todo = await app.prisma.todo.findUnique({
            where: { id: req.params.id }
        });

        if (!todo) {
            return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Todo not found'
            });
        }

        const comment = await app.prisma.comment.create({
            data: {
            text: req.body.text,
            todoId: req.params.id,
            authorId: req.user!.id,
            },
        });
        return reply.status(200).send(comment);
        } catch (error) {
        return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to create comment' 
        });
        }
    }
    );
}