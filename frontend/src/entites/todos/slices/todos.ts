// todoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo, TodoList, TodoListWithTodos, TodoWithComments } from '../models/todo';

// interface ErrorResponse {
//   statusCode: number;
//   error: string;
//   message: string;
// }

// ---------- Базовый URL из спецификации ----------
const baseUrl = '';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Предполагаем, что токен хранится в слайсе auth (например, auth.token)
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Теги для автоматической инвалидации кэша
  tagTypes: ['TodoList', 'Todo', 'Comment'],
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
    getTodoListWithTodos: builder.query<TodoListWithTodos, string>({
      query: (id) => `/api-todo/todolists/${id}`,
      providesTags: (_, __, id) => [{ type: 'TodoList', id }],
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
        { type: 'TodoList', id: todoListId },
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
      invalidatesTags: (_, __, { todoListId }) => [
        { type: 'TodoList', id: todoListId },
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
  useUpdateTodoListMutation
} = todoApi;