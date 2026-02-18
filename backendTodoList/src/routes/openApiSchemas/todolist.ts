

export const createTodoListSchema = {
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

export const getTodoListSchema = {
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

export const createTodoSchema = {
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

export const getTodosTodoListSchemas = {
    tags: ["TodoLists"],
    summary: "Получить конкретный список задач со всеми задачами",
    description:
        "Возвращает информацию о списке задач и все задачи в этом списке, если пользователь имеет доступ",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        required: ["id"],
        properties: {
        id: {
            type: "string",
            format: "uuid",
            description: "ID списка задач",
            examples: ["123e4567-e89b-12d3-a456-426614174000"],
        },
        },
    },
    response: {
        200: {
        description: "Список задач и задачи успешно получены",
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            ownerId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            todos: {
            type: "array",
            items: { $ref: "Todo#" },
            },
        },
        },
        400: {
        description: "Ошибка запроса",
        content: {
            "application/json": {
            schema: { $ref: "Error#" },
            },
        },
        },
        401: {
        description: "Не авторизован",
        content: {
            "application/json": {
            schema: { $ref: "Error#" },
            },
        },
        },
        404: {
        description: "Список не найден или доступ запрещён",
        content: {
            "application/json": {
            schema: { $ref: "Error#" },
            },
        },
        },
    },
}

export const deleteTodoList = {
    tags: ["TodoLists"],
    summary: "Удалить список задач",
    description: "Удаляет список задач и все связанные с ним задачи и комментарии",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID списка задач",
            },
        },
    },
    response: {
        204: {
            description: "Список успешно удален",
            type: "null",
        },
        401: {
            description: "Не авторизован",
            content: { "application/json": { schema: { $ref: "Error#" } } },
        },
        403: {
            description: "Доступ запрещен",
            content: { "application/json": { schema: { $ref: "Error#" } } },
        },
        404: {
            description: "Список не найден",
            content: { "application/json": { schema: { $ref: "Error#" } } },
        },
    },
}