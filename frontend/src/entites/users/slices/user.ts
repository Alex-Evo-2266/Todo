// todoApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../../shared/helpers/baseQuery';

export type User = { 
  id: string; 
  name: string
  email: string;
  role: string
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
  }),
});

export const {
    useGetUserQuery
} = userApi;


      