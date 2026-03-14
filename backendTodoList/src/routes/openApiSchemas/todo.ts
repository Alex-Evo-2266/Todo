export const creactComment = {
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

export const deleteTodo = {
    tags: ["Todos"],
    summary: "Удалить задачу",
    description: "Удаляет задачу и все связанные с ней комментарии",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID задачи",
            },
        },
    },
    response: {
        204: { description: "Задача успешно удалена", type: "null" },
        401: { description: "Не авторизован", content: { "application/json": { schema: { $ref: "Error#" } } } },
        403: { description: "Доступ запрещен", content: { "application/json": { schema: { $ref: "Error#" } } } },
        404: { description: "Задача не найдена", content: { "application/json": { schema: { $ref: "Error#" } } } },
    },
}

export const deleteComment = {
    tags: ["Comments"],
    summary: "Удалить комментарий",
    description: "Удаляет комментарий",
    security: [{ bearerAuth: [] }],
    params: {
    type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "ID комментария",
            },
        },
    },
    response: {
        204: { description: "Комментарий успешно удален", type: "null" },
        401: { description: "Не авторизован", content: { "application/json": { schema: { $ref: "Error#" } } } },
        403: { description: "Доступ запрещен", content: { "application/json": { schema: { $ref: "Error#" } } } },
        404: { description: "Комментарий не найден", content: { "application/json": { schema: { $ref: "Error#" } } } },
    },
}

export const getTodoSchema = {
    tags: ["Todos"],
    summary: "Получить конкретную задачу с комментариями",
    description:
      "Возвращает задачу и все комментарии к ней, если пользователь имеет доступ к родительскому списку",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "ID задачи",
          examples: ["123e4567-e89b-12d3-a456-426614174002"],
        },
      },
    },
    response: {
      200: {
        description: "Задача и комментарии успешно получены",
        type: "object",
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', examples: ['Купить продукты'] },
          description: { type: 'string', examples: ['Молоко, хлеб, яйца'] },
          completed: { type: 'boolean', examples: [false] },
          todoListId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          contVersion: {type: 'integer'},
          date: { type: 'string', format: 'date-time' },
          posVersion: {type: 'integer'},
          runk: {type: 'string'},
          status: {type: "string"},
          parentId: {type: "string", format: 'uuid'},
          comments: {
            type: "array",
            items: { $ref: "Comment#" }, // если есть схема комментария
          },
        },
      },
      400: {
        description: "Ошибка запроса",
        content: { "application/json": { schema: { $ref: "Error#" } } },
      },
      401: {
        description: "Не авторизован",
        content: { "application/json": { schema: { $ref: "Error#" } } },
      },
      404: {
        description: "Задача не найдена или доступ запрещён",
        content: { "application/json": { schema: { $ref: "Error#" } } },
      },
    },
  }


export const updateTodoSchema = {
  tags: ['Todos'],
  summary: 'Изменить задачу',
  description: 'Изменяет задачу',
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
        },
        contVersion: {
            type: 'integer',
            description: 'версия',
            examples: [1]
        },
      }
  },
  response: {
      201: {
      description: 'Задача успешно изменена',
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