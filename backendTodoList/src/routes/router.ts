import { authPrivilege } from "@root/hooks/authPrivilege.js";
import { FastifyInstance } from "fastify";
import { createTodoListSchema, createTodoSchema, deleteTodoList, editTodoListSchema, getTodoListSchema, getTodosTodoListSchemas, moveTodoSchema } from "./openApiSchemas/todolist.js";
import { creactComment, deleteComment, deleteTodo, getTodoSchema, updateTodoSchema } from "./openApiSchemas/todo.js";
import { LexoRank } from "lexorank";


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

    app.put<{ Body: { title: string }, Params: { id: string } }>(
      "/todolists/:id",
      {
        preHandler: authPrivilege("todolist:create"),
        schema: editTodoListSchema
      },
      async (req, reply) => {
        try{
          const userId = req.user!.id;
          const id = req.params.id;
          return await app.prisma.todoList.update({
            where: {id: id, OR:[
              { ownerId: userId },
              { access: { some: { userId } } }
            ]},
            data: {title: req.body.title},
            select: {
              title: true,
              ownerId: true,
              id: true,
              createdAt: true
            }
          })

        }catch(error)
        {
          console.log(error)
          return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to update todo list' 
          });
        }
      }
    )

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
            where: { id: req.params.id },
        });

        if (!todoList) {
            return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Todo list not found'
            });
        }

        const lastTodo = await app.prisma.todo.findFirst({
              where: {todoListId: req.params.id},
              orderBy: {runk: "desc"}
            })

        let display_order = LexoRank.middle().toString()
        if(lastTodo){
          const last = LexoRank.parse(lastTodo.runk)
          display_order = last.genNext().toString()
        }

        const todo = await app.prisma.todo.create({
            data: {
            title: req.body.title,
            description: req.body.description ?? "",
            todoListId: req.params.id,
            runk: display_order
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
            todos: {
              orderBy: {
                runk: "asc"
              }
            }, 
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

    app.put<{ Body: { posVersion: number, parentId?:string, targetTask?: string,  placement:string}, Params: { id: string } }>(
      "/todo/:id/move",
      {
        preHandler: authPrivilege("todolist:read"),
        schema: moveTodoSchema
      },
      async (req, reply) => {
        try{
          const userId = req.user!.id;
          const id = req.params.id;
          const {posVersion, targetTask, placement} = req.body

          // 2. Проверяем существование перемещаемой колонки и её принадлежность доске
          const task = await app.prisma.todo.findFirst({
            where: {id}
          })
          if (!task) {
            return reply.code(404).send({ error: 'Todo not found in this board' });
          }
          if (task.posVersion !== posVersion) {
            return reply.code(409).send({
              error: "Position conflict",
              message: "The task has been moved by another user. Please refresh and try again.",
              data: task
            });
          }

          // 3. Если указана целевая колонка, проверяем её
          if (targetTask) {
            const targetTaskItem = app.prisma.todo.findFirst({
              where: {id: targetTask, todoListId: task.todoListId}
            })
            if (!targetTaskItem) {
              return reply.code(404).send({ error: 'Target column not found in this board' });
            }
            // Нельзя перемещать колонку относительно самой себя
            if (targetTask === id) {
              return reply.code(400).send({ error: 'Cannot move column relative to itself' });
            }
          }

          let newOrder: string;

          const getPrevColumn = async (order: string) => {
            return app.prisma.todo.findFirst({
              where:{
                todoListId: task.todoListId,
                runk: {lt: order}
              },
              orderBy:{
                runk: "desc"
              }
            })
          };

          // Вспомогательная функция для получения следующей колонки относительно заданного order
          const getNextColumn = async (order: string) => {
            return app.prisma.todo.findFirst({
              where:{
                todoListId: task.todoListId,
                runk: {gt: order}
              },
              orderBy:{
                runk: "asc"
              }
            })
          };

          if (placement === 'start') {
            // Переместить в начало: перед первой колонкой
            const firstColumn = await app.prisma.todo.findFirst({
              where: {todoListId: task.todoListId},
              orderBy: {runk: "asc"}
            })
            if (firstColumn) {
              newOrder = LexoRank.parse(firstColumn.runk).genPrev().toString();
            } else {
              // Если колонок нет вообще (только текущая), используем middle
              newOrder = LexoRank.middle().toString();
            }
          }
          else if (placement === 'end') {
            // Переместить в конец: после последней колонки
            const lastColumn = await app.prisma.todo.findFirst({
              where: {todoListId: task.todoListId},
              orderBy: {runk: "desc"}
            })
            if (lastColumn) {
              newOrder = LexoRank.parse(lastColumn.runk).genNext().toString();
            } else {
              newOrder = LexoRank.middle().toString();
            }
          }
          else if (placement === 'before' || placement === 'after') {
            if (!targetTask) {
              return reply.code(400).send({ error: 'targetColumnId is required for before/after placement' });
            }

            // Получаем целевую колонку (уже проверили существование)
            const target = await app.prisma.todo.findFirst({
              where: {id: targetTask, todoListId: task.todoListId}
            })
            if(!target)return;

              if (placement === 'before') {
              // Вставить перед target: найти предыдущую колонку
              const prev = await getPrevColumn(target.runk);
              if (prev) {
                // Есть предыдущая — вставляем между prev и target
                newOrder = LexoRank.parse(prev.runk)
                  .between(LexoRank.parse(target.runk))
                  .toString();
              } else {
                // target первая — вставляем перед ней (genPrev)
                newOrder = LexoRank.parse(target.runk).genPrev().toString();
              }
            } else { // after
              // Вставить после target: найти следующую колонку
              const next = await getNextColumn(target.runk);
              if (next) {
                // Есть следующая — вставляем между target и next
                newOrder = LexoRank.parse(target.runk)
                  .between(LexoRank.parse(next.runk))
                  .toString();
              } else {
                // target последняя — вставляем после неё (genNext)
                newOrder = LexoRank.parse(target.runk).genNext().toString();
              }
            }
          }
          else {
            return reply.code(400).send({ error: 'Invalid placement value' });
          }

          const retData = await app.prisma.todo.update({
            where: {id: id, todoList:{
              OR:[
                { ownerId: userId },
                { access: { some: { userId } } }
              ]
            } },
            data: {runk: newOrder, posVersion: task.posVersion + 1},
            select: {
              title: true,
              runk: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              posVersion: true,
              contVersion: true,
              completed: true,
              status: true
            }
          })
              // 6. Возвращаем обновлённую колонку (можно вернуть полные данные)
              return reply.code(200).send(retData);


        }catch(error)
        {
          console.log(error)
          return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to update todo list' 
          });
        }
      }
    )


    app.put<{ Body: { contVersion: number, description?:string, title?: string }, Params: { id: string } }>(
      "/todo/:id",
      {
        preHandler: authPrivilege("todolist:read"),
        schema: updateTodoSchema
      },
      async (req, reply) => {
        try{
          const userId = req.user!.id;
          const id = req.params.id;
          const {contVersion, description, title} = req.body

          // 2. Проверяем существование перемещаемой колонки и её принадлежность доске
          const task = await app.prisma.todo.findFirst({
            where: {id}
          })
          if (!task) {
            return reply.code(404).send({ error: 'Todo not found in this board' });
          }
          if (task.contVersion !== contVersion) {
            return reply.code(409).send({
              error: "Position conflict",
              message: "The task has been moved by another user. Please refresh and try again.",
              data: task
            });
          }

          const retData = await app.prisma.todo.update({
            where: {id: id, todoList:{
              OR:[
                { ownerId: userId },
                { access: { some: { userId } } }
              ]
            } },
            data: {title, description, contVersion: task.contVersion + 1},
            select: {
              title: true,
              description: true,
              runk: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              posVersion: true,
              contVersion: true,
              completed: true,
              status: true,
            }
          })
              // 6. Возвращаем обновлённую колонку (можно вернуть полные данные)
              return reply.code(200).send(retData);


        }catch(error)
        {
          console.log(error)
          return reply.status(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: 'Failed to update todo list' 
          });
        }
      }
    )
}
