const accessItemSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    todoListId: { type: "string" },
    userId: { type: "string" },
  },
};

export const grantAccessSchema = {
  tags: ["TodoLists"],
  summary: "Выдать доступ к списку задач",
  description: "Только владелец списка может выдать доступ другому пользователю",
  security: [{ bearerAuth: [] }],

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "ID списка задач",
      },
    },
  },

  body: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        description: "ID пользователя, которому выдается доступ",
      },
    },
  },

  response: {
    200: {
      description: "Доступ успешно выдан",
      ...accessItemSchema,
    },

    400: {
      description: "Ошибка запроса",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },

    403: {
      description: "Нет прав (не владелец)",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },

    404: {
      description: "Список не найден",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },
  },
};


export const revokeAccessSchema = {
  tags: ["TodoLists"],
  summary: "Отозвать доступ к списку задач",
  description: "Только владелец списка может отозвать доступ",
  security: [{ bearerAuth: [] }],

  params: {
    type: "object",
    required: ["id", "userId"],
    properties: {
      id: {
        type: "string",
        description: "ID списка задач",
      },
      userId: {
        type: "string",
        description: "ID пользователя",
      },
    },
  },

  response: {
    204: {
      description: "Доступ успешно отозван",
      type: "null",
    },

    400: {
      description: "Ошибка запроса",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },

    403: {
      description: "Нет прав (не владелец)",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },

    404: {
      description: "Список не найден",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },
  },
};

export const getAccessListSchema = {
  tags: ["TodoLists"],
  summary: "Получить список пользователей с доступом",
  description:
    "Возвращает список пользователей, имеющих доступ к списку задач (включая владельца косвенно)",
  security: [{ bearerAuth: [] }],

  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "ID списка задач",
      },
    },
  },

  response: {
    200: {
      description: "Список доступов",
      type: "array",
      items: accessItemSchema,
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
      description: "Список не найден или нет доступа",
      content: {
        "application/json": {
          schema: { $ref: "Error#" },
        },
      },
    },
  },
};