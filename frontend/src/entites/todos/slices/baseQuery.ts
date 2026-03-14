import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { redirectToLogin } from '../../../shared/helpers/refrash'

const baseQuery = fetchBaseQuery({
    baseUrl: '',
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {

    redirectToLogin()

      // повторяем оригинальный запрос
    result = await baseQuery(args, api, extraOptions)

  }

  return result
}