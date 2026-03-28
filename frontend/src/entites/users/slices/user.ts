// todoApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../shared/helpers/baseQuery';

export type User = { 
  id: string; 
  name: string
  email: string;
  role: string
}

export type UserAll = { 
  users: User[]
  next_cursor: string | null;
  total: number;
}

type GetAllUsersParams = {
  limit?: number;
  cursor?: string;
  search?: string;
};


// ---------- Базовый URL из спецификации ----------

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // ----- User -----
    getUser: builder.query<User, string>({
      query: (id) => `/api-auth/users/${id}`,
      providesTags: (_, __, id) =>
          [{ type: 'User', id: id }]
    }),
    getAllUser: builder.query<UserAll, GetAllUsersParams>({
      query: (params) => ({
        url: `/api-auth/users/all`,
        params,
      }),

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },

      merge: (currentCache, newData, { arg }) => {
        if (!arg?.cursor) {
          // 🔹 первый запрос (reset)
          return newData;
        }

        // 🔹 добавляем новые данные
        currentCache.users.push(...newData.users);
        currentCache.next_cursor = newData.next_cursor;
        currentCache.total = newData.total;
      },

      forceRefetch({ currentArg, previousArg }) {
        // 🔹 если меняется search — сбрасываем
        return currentArg?.search !== previousArg?.search || currentArg?.cursor !== previousArg?.cursor;
      },

      providesTags: () => [{ type: 'User', id: "LIST" }],
    }),
  }),
});

export const {
    useGetUserQuery,
    useGetAllUserQuery
} = userApi;


      