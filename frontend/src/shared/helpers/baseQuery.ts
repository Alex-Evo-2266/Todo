import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { authManager } from '../../config'
import { refreshToken } from 'alex-evo-sh-auth'

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers) => {
      const token = authManager.getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
})


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // пытаемся обновить токен
    const newToken = await refreshToken(authManager.config)

    if (newToken) {

      result = await baseQuery(args, api, extraOptions)

    }
  }

  return result
}