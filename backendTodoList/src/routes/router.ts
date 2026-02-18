import { authPrivilege } from "@root/hooks/authPrivilege.js";
import { FastifyInstance } from "fastify";
import { createTodoListSchema, createTodoSchema, deleteTodoList, getTodoListSchema, getTodosTodoListSchemas } from "./openApiSchemas/todolist.js";
import { creactComment, deleteComment, deleteTodo, getTodoSchema } from "./openApiSchemas/todo.js";


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
        schema: createTodoListSchema
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
        schema: getTodoListSchema
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
        schema: createTodoSchema
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
     * Get specific TodoList with all its todos
     * Only owner or users with access can view
     */
    app.get<{ Params: { id: string } }>(
    "/todolists/:id",
    {
        preHandler: authPrivilege("todolist:read"),
        schema: getTodosTodoListSchemas,
    },
    async (req, reply) => {
        try {
        const userId = req.user!.id;
        const { id } = req.params;

        // Ищем список, к которому пользователь имеет доступ (владелец или есть запись в access)
        const todoList = await app.prisma.todoList.findFirst({
            where: {
            id,
            OR: [{ ownerId: userId }, { access: { some: { userId } } }],
            },
            include: {
            todos: true, // включаем все задачи списка
            },
        });

        if (!todoList) {
            return reply.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Todo list not found or access denied",
            });
        }

        return reply.status(200).send(todoList);
        } catch (error) {
        app.log.error(error);
        return reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Failed to fetch todo list",
        });
        }
    },
    );

    app.get<{Params: {id: string}}>(
      "/todos/:id",
      {
        preHandler: authPrivilege("todolist:read"),
        schema: getTodoSchema
      },
      async (req, reply) => {
        try{
          const userId = req.user!.id;
          const { id } = req.params;
          const todo = app.prisma.todo.findFirst({
            where: {
              id,
              todoList: {
                OR: [
                  { ownerId: userId },
                  { access: { some: { userId } } },
                ]
              }
            },
            include: {
              comments: true
            }
          })

        if (!todo) {
          return reply.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Todo not found or access denied",
          });
        }

        return reply.status(200).send(todo);
      }
      catch (error) {
        app.log.error(error);
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Failed to fetch todo",
        });
      }}
    )

    /**
     * Add comment
     */
    app.post<{ Body: { text: string }, Params: { id: string } }>(
    "/todos/:id/comments",
    {
        preHandler: authPrivilege("todolist:comment"),
        schema: creactComment
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

    /**
 * Delete TodoList (cascade: todos and comments)
 * Only owner or user with delete privilege can delete
 */
app.delete<{ Params: { id: string } }>(
  "/todolists/:id",
  {
    preHandler: authPrivilege("todolist:delete"),
    schema: deleteTodoList
  },
  async (req, reply) => {
    const userId = req.user!.id;
    const { id } = req.params;

    // Проверяем, что пользователь имеет право на удаление этого списка
    const todoList = await app.prisma.todoList.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { access: { some: { userId } } }
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

    try {
      // Если в схеме Prisma настроено onDelete: Cascade, достаточно удалить список
      await app.prisma.todoList.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      app.log.error(error);
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Failed to delete todo list",
      });
    }
  },
);


/**
 * Delete Todo (cascade: comments)
 * User must have access to parent TodoList
 */
app.delete<{ Params: { id: string } }>(
  "/todos/:id",
  {
    preHandler: authPrivilege("todo:delete"),
    schema: deleteTodo
  },
  async (req, reply) => {
    const userId = req.user!.id;
    const { id } = req.params;

    // Находим задачу и проверяем доступ через родительский список
    const todo = await app.prisma.todo.findUnique({
      where: { id },
      include: {
        todoList: {
          include: {
            access: { where: { userId } },
          },
        },
      },
    });

    if (!todo) {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Todo not found",
      });
    }

    // Проверяем, является ли пользователь владельцем списка или имеет доступ с правом удаления задач
    const isOwner = todo.todoList.ownerId === userId;
    const hasAccess = todo.todoList.access.length > 0 && todo.todoList.access[0]; // предполагаем поле canDeleteTodos

    if (!isOwner && !hasAccess) {
      return reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "You do not have permission to delete this todo",
      });
    }

    try {
      await app.prisma.todo.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      app.log.error(error);
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Failed to delete todo",
      });
    }
  },
);

/**
 * Delete Comment
 * User must be the author or have access to parent TodoList with delete privilege
 */
app.delete<{ Params: { id: string } }>(
  "/comments/:id",
  {
    preHandler: authPrivilege("comment:delete"),
    schema: deleteComment,
  },
  async (req, reply) => {
    const userId = req.user!.id;
    const { id } = req.params;

    // Находим комментарий и связанные данные для проверки прав
    const comment = await app.prisma.comment.findUnique({
      where: { id },
      include: {
        todo: {
          include: {
            todoList: {
              include: {
                access: { where: { userId } },
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Comment not found",
      });
    }

    // Права: автор комментария или владелец списка / участник с правом удаления комментариев
    const isAuthor = comment.authorId === userId;
    const isOwner = comment.todo.todoList.ownerId === userId;
    const hasAccess = comment.todo.todoList.access.length > 0 && comment.todo.todoList.access[0];

    if (!isAuthor && !isOwner && !hasAccess) {
      return reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "You do not have permission to delete this comment",
      });
    }

    try {
      await app.prisma.comment.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      app.log.error(error);
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Failed to delete comment",
      });
    }
  },
);
}
