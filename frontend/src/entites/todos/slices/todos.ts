// todoApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import type { Todo, TodoList, TodoListWithTodos, TodoWithComments } from '../models/todo';
import { baseQueryWithReauth } from '../../../shared/helpers/baseQuery';

export type MoveTodoRequest = { 
  todoList: string, 
  id: string; 
  posVersion: number, 
  parentId?:string, 
  targetTask?: string, 
  placement: "before" | "after" | "end" | "start" 
}

export type CheckTodoRequest = { 
  id: string
  posVersion: number
  contVersion: number
  check: boolean
  todoList: string
}

export type EditTodoRequest = { 
  todoListId: string, 
  id: string; 
  contVersion: number
  title: string;
  description?: string;
  date?: string
}

export type AccessItem = {
  id: string;
  todoListId: string;
  userId: string;
};

export type GetTodosArgs = {
  id: string
  cursor?: string | null
  limit?: number

  // твои фильтры
  completed?: boolean
  search?: string
  dateFrom?: string
  dateTo?: string
}


export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: baseQueryWithReauth,
  // Теги для автоматической инвалидации кэша
  tagTypes: ['TodoList', 'Todo', 'Comment', 'TodoListDetail', 'Access'],
  endpoints: (builder) => ({
    // ----- TodoLists -----
    // GET /api-todo/todolists – получить все списки пользователя
    getTodoLists: builder.query<TodoList[], void>({
      query: () => '/api-todo/todolists',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'TodoList' as const, id })),
              { type: 'TodoList', id: 'LIST' },
            ]
          : [{ type: 'TodoList', id: 'LIST' }],
    }),

    // POST /api-todo/todolists – создать новый список
    createTodoList: builder.mutation<TodoList, { title: string }>({
      query: (body) => ({
        url: '/api-todo/todolists',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'TodoList', id: 'LIST' }],
    }),

    // POST /api-todo/todolists – создать новый список
    updateTodoList: builder.mutation<TodoList, {id: string, title: string }>({
      query: (data) => ({
        url: `/api-todo/todolists/${data.id}`,
        method: 'PUT',
        body: {title: data.title},
      }),
      invalidatesTags: (_, __, data) => [{ type: 'TodoList', id: data.id }],
    }),

    // GET /api-todo/todolists/{id} – получить список с задачами
    getTodoListWithTodos: builder.query<
      TodoListWithTodos,
      GetTodosArgs
    >({
      query: ({ id, cursor, ...params }) => ({
        url: `/api-todo/todolists/${id}`,
        params: {
          ...params,
          ...(cursor ? {cursor}: {})
        },
      }),

      // 🔥 убираем cursor из ключа кеша
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.id}-${JSON.stringify({
          ...queryArgs,
          cursor: undefined
        })}`
      },

      // 🔥 объединяем страницы
      merge: (currentCache, newData) => {
        if (!currentCache.todos) {
          currentCache.todos = []
        }

        const existingIds = new Set(currentCache.todos.map(t => t.id))

        newData.todos.forEach(todo => {
          if (!existingIds.has(todo.id)) {
            currentCache.todos.push(todo)
          }
        })

        currentCache.meta = newData.meta
      },

      // 🔥 когда делать новый запрос
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },

      providesTags: (_, __, arg) => [
        { type: 'TodoListDetail', id: arg.id },
      ],
    }),

    // DELETE /api-todo/todolists/{id} – удалить список
    deleteTodoList: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api-todo/todolists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'TodoList', id: 'LIST' }],
    }),

    // ----- Todos -----
    // POST /api-todo/todolists/{id}/todos – создать задачу в списке
    createTodo: builder.mutation<
      Todo,
      { todoListId: string; title: string; description?: string }
>({
      query: ({ todoListId, ...body }) => ({
        url: `/api-todo/todolists/${todoListId}/todos`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { todoListId }) => [
        { type: 'TodoListDetail', id: todoListId },
      ],
    }),

    // GET /api-todo/todos/{id} – получить задачу с комментариями
    getTodoWithComments: builder.query<TodoWithComments, string>({
      query: (id) => `/api-todo/todos/${id}`,
      providesTags: (_, __, id) => [{ type: 'Todo', id }],
    }),

    // DELETE /api-todo/todos/{id} – удалить задачу (требуется id родительского списка для инвалидации)
    deleteTodo: builder.mutation<void, { id: string; todoListId: string }>({
      query: ({ id }) => ({
        url: `/api-todo/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { todoListId, id }) => [
        { type: 'TodoListDetail', id: todoListId },
        { type: 'Todo', id }
      ],
    }),

    // ----- Comments -----
    // POST /api-todo/todos/{id}/comments – добавить комментарий к задаче
    addComment: builder.mutation<Comment, { todoId: string; text: string }>({
      query: ({ todoId, ...body }) => ({
        url: `/api-todo/todos/${todoId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { todoId }) => [{ type: 'Todo', id: todoId }],
    }),

    // DELETE /api-todo/comments/{id} – удалить комментарий (требуется id задачи для инвалидации)
    deleteComment: builder.mutation<void, { id: string; todoId: string }>({
      query: ({ id }) => ({
        url: `/api-todo/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { todoId }) => [{ type: 'Todo', id: todoId }],
    }),

    moveTodo: builder.mutation<void, MoveTodoRequest>({
      query: ({ id, placement, posVersion, parentId, targetTask }) => ({
        url: `/api-todo/todo/${id}/move`,
        method: 'PUT',
        body: {
          parentId,
          placement,
          targetTask,
          posVersion,
        },
      }),

      invalidatesTags: [],

      async onQueryStarted(
        { id, placement, targetTask, todoList },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults: any[] = []

        const state = getState()

        const queries = todoApi.util.selectInvalidatedBy(state, [
          { type: 'TodoListDetail', id: todoList },
        ])

        // 🔥 optimistic reorder
        queries.forEach(({ originalArgs }) => {
          const patchResult = dispatch(
            todoApi.util.updateQueryData(
              'getTodoListWithTodos',
              originalArgs,
              (draft) => {
                const todos = draft.todos

                const sourceIndex = todos.findIndex((t) => t.id === id)
                if (sourceIndex === -1) return

                const [moved] = todos.splice(sourceIndex, 1)

                let targetIndex = todos.findIndex((t) => t.id === targetTask)

                if (targetIndex === -1) {
                  targetIndex =
                    placement === 'end' ? todos.length : 0
                }

                if (targetIndex > sourceIndex) {
                  targetIndex--
                }

                if (placement === 'after') targetIndex++
                if (placement === 'start') targetIndex = 0
                if (placement === 'end') targetIndex = todos.length

                // 👉 optimistic флаг
                moved._optimistic = true

                todos.splice(targetIndex, 0, moved)
              }
            )
          )

          patchResults.push({ patchResult, originalArgs })
        })

        try {
          const { data } = await queryFulfilled

          // 🔥 success → синхронизация с сервером
          patchResults.forEach(({ originalArgs }) => {
            dispatch(
              todoApi.util.updateQueryData(
                'getTodoListWithTodos',
                originalArgs,
                (draft) => {
                  const todo = draft.todos.find((t) => t.id === id)
                  if (!todo) return

                  // 👉 обновляем реальные данные
                  Object.assign(todo, data)

                  delete todo._optimistic
                }
              )
            )
          })
        } catch (err: any) {
          // 🔥 rollback optimistic
          patchResults.forEach(({ patchResult }) => patchResult.undo())

          // 🔥 если конфликт позиций
          if (err?.error?.status === 409 && err?.error?.data) {
            const serverTodos = err.error.data

            // 👉 сервер может вернуть массив
            queries.forEach(({ originalArgs }) => {
              dispatch(
                todoApi.util.updateQueryData(
                  'getTodoListWithTodos',
                  originalArgs,
                  (draft) => {
                    if (Array.isArray(serverTodos)) {
                      // 🔥 заменяем порядок
                      draft.todos = serverTodos
                    } else {
                      // 🔥 или один элемент
                      const todo = draft.todos.find((t) => t.id === id)
                      if (todo) Object.assign(todo, serverTodos)
                    }
                  }
                )
              )
            })
          }
        }
      },
    }),

    checkTodo: builder.mutation<void, CheckTodoRequest>({
      query: ({ id, contVersion, posVersion, check }) => ({
        url: `/api-todo/todo/${id}/check`,
        method: 'PUT',
        body: {
          check,
          contVersion,
          posVersion,
        },
      }),

      invalidatesTags: [],

      async onQueryStarted(
        { id, todoList, check },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults: any[] = []

        const state = getState()

        const queries = todoApi.util.selectInvalidatedBy(state, [
          { type: 'TodoListDetail', id: todoList },
        ])

        // 🔥 optimistic update
        queries.forEach(({ originalArgs }) => {
          const patchResult = dispatch(
            todoApi.util.updateQueryData(
              'getTodoListWithTodos',
              originalArgs,
              (draft) => {
                const todo = draft.todos.find((t) => t.id === id)
                if (!todo) return

                todo.completed = check
              }
            )
          )

          patchResults.push({ patchResult, originalArgs })
        })

        try {
          const { data } = await queryFulfilled

          // 🔥 success → обновляем реальными данными
          patchResults.forEach(({ originalArgs }) => {
            dispatch(
              todoApi.util.updateQueryData(
                'getTodoListWithTodos',
                originalArgs,
                (draft) => {
                  const todo = draft.todos.find((t) => t.id === id)
                  if (!todo) return

                  // 👉 заменяем тем что пришло с сервера
                  Object.assign(todo, data)

                }
              )
            )
          })
        } catch (err: any) {
          // 🔥 откатываем optimistic
          patchResults.forEach(({ patchResult }) => patchResult.undo())

          // 🔥 если 409 → применяем реальные данные
          if (err?.error?.status === 409 && err?.error?.data) {
            const serverTodo = err.error.data

            queries.forEach(({ originalArgs }) => {
              dispatch(
                todoApi.util.updateQueryData(
                  'getTodoListWithTodos',
                  originalArgs,
                  (draft) => {
                    const todo = draft.todos.find((t) => t.id === id)
                    if (!todo) return

                    Object.assign(todo, serverTodo)
                  }
                )
              )
            })
          }
        }
      },
    }),

    editTodo: builder.mutation<void, EditTodoRequest>({
      query: ({ id, todoListId, ...body }) => ({
        url: `/api-todo/todo/${id}`,
        method: 'PUT',
        body:body
      }),
      invalidatesTags: (_, __, { todoListId, id }) => [{ type: 'TodoListDetail', id: todoListId }, { type: 'Todo', id }],
    }),

    getAccessList: builder.query<AccessItem[], string>({
      query: (todoListId) => ({
        url: `/api-todo/todolists/${todoListId}/access`,
        method: "GET",
      }),

      providesTags: (_, __, todoListId) => [
        { type: "Access", id: todoListId },
      ],
    }),

    // ➕ Выдать доступ
    grantAccess: builder.mutation<
      AccessItem,
      { todoListId: string; userId: string }
    >({
      query: ({ todoListId, userId }) => ({
        url: `/api-todo/todolists/${todoListId}/access`,
        method: "POST",
        body: { userId },
      }),

      invalidatesTags: (_, __, { todoListId }) => [
        { type: "Access", id: todoListId },
      ],
    }),

    // ➖ Забрать доступ
    revokeAccess: builder.mutation<
      void,
      { todoListId: string; userId: string }
    >({
      query: ({ todoListId, userId }) => ({
        url: `/api-todo/todolists/${todoListId}/access/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_, __, { todoListId }) => [
        { type: "Access", id: todoListId },
      ],
    }),
  }),
});

// Автоматически сгенерированные хуки для использования в компонентах
export const {
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useGetTodoListWithTodosQuery,
  useDeleteTodoListMutation,
  useCreateTodoMutation,
  useGetTodoWithCommentsQuery,
  useDeleteTodoMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateTodoListMutation,
  useMoveTodoMutation,
  useEditTodoMutation,
  useRevokeAccessMutation,
  useGetAccessListQuery,
  useGrantAccessMutation,
  useCheckTodoMutation
} = todoApi;


      