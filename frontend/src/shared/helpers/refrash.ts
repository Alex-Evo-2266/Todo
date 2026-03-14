import { AUTH_FRONTEND_API } from "../../consts"

export const redirectToLoginBase = (authFrontendUrl: string, appId?: string) => {
    const next = encodeURIComponent(window.location.href)

    let url = `${authFrontendUrl}/login?next=${next}`
    if (appId) {
      url += `&app=${appId}`
    }

    window.location.href = url
  }

export const redirectToLogin = () => redirectToLoginBase(AUTH_FRONTEND_API)