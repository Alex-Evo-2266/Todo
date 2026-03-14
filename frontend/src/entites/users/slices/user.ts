// todoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type User = { 
  id: string; 
  name: string
  email: string;
  role: string
}

// ---------- Базовый URL из спецификации ----------
const baseUrl = '';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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


      