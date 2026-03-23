

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


export const editTodoListSchema = {
    tags: ['TodoLists'],
    summary: 'Изменить список задач',
    description: 'Изменяет название списка задач',
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
            description: 'Название списка задач',
            minLength: 1,
            maxLength: 100,
            examples: ['Проект по разработке']
        }
        }
    },
    response: {
        201: {
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
    querystring: {
        type: "object",
        properties: {
            completed: {
                type: "string",
                enum: ["true", "false"],
            },
            search: {
                type: "string",
                description: "Поиск по названию задачи",
            },
            dateFrom: {
                type: "string",
                format: "date-time",
                description: "Дата выполнения ОТ",
            },
            dateTo: {
                type: "string",
                format: "date-time",
                description: "Дата выполнения ДО",
            },
            createDateFrom: {
                type: "string",
                format: "date-time",
                description: "Дата создания ОТ",
            },
            createDateTo: {
                type: "string",
                format: "date-time",
                description: "Дата создания ДО",
            },
            sortBy: {
                type: "string",
                enum: ["createdAt", "updatedAt", "title", "runk"],
                default: "runk",
                description: "Поле сортировки",
            },
            sortOrder: {
                type: "string",
                enum: ["asc", "desc"],
                default: "asc",
                description: "Порядок сортировки",
            },
            limit: {
                type: 'integer',
                description: 'количество',
                examples: [20]
            },
            cursor: {
                anyOf: [
                    { type: "string" },
                    { type: "null" }
                ],
                description: "cursor",
                examples: ["123e4567-e89b-12d3-a456-426614174000", null],
            }
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
            meta: { type: "object",
                properties: {
                    nextCursor:{
                        type: "string",
                        format: "uuid",
                        description: "Новый курсор",
                        examples: ["123e4567-e89b-12d3-a456-426614174000"],
                    },
                    limit:{
                        type: 'integer',
                        description: 'количество',
                        examples: [20]
                    }
                }
            },
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

export const moveTodoSchema = {
    tags: ['Todos'],
    summary: 'Переместить задачу',
    description: 'Изменяет порядок задач',
    security: [{ bearerAuth: [] }],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
        id: {
            type: 'string',
            format: 'uuid',
            description: 'ID задачи',
            examples: ['123e4567-e89b-12d3-a456-426614174000']
        }
        }
    },
    body: {
        type: 'object',
        required: ['posVersion'],
        properties: {
            posVersion: {
                type: 'integer',
                description: 'версия',
                examples: [1]
            },
            parentId: {
                type: 'string',
                description: "ID родителя",
                format: 'uuid',
                examples: ['123e4567-e89b-12d3-a456-426614174000']
            },
            targetTask: {
                type: 'string',
                description: "ID относительно какой таски размещать",
                format: 'uuid',
                examples: ['123e4567-e89b-12d3-a456-426614174000']
            },
            placement: { type: 'string', enum:['before', 'after','start', 'end'] },
            date: { type: 'string', format: 'date-time' },
        }
    },
    response: {
        201: {
            description: 'Список успешно создан',
            type: "object",
            properties:{
                title: {type: "string"},
                runk: {type: "string"},
                id: {type: "string"},
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                posVersion: {type: "integer"},
                contVersion: {type: "integer"},
                completed: {type: "boolean"},
                status: {type: "string"}
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