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
}

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
    getAllUser: builder.query<UserAll, void>({
      query: () => `/api-auth/users/all`,
      providesTags: () =>
          [{ type: 'User', id: "LIST" }]
    }),
  }),
});

export const {
    useGetUserQuery,
    useGetAllUserQuery
} = userApi;


      