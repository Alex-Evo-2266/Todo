import { AuthManager, Config } from "alex-evo-sh-auth";

const CLIENT_ID = import.meta.env["VITE_TODO_CLIENT_ID"]
const BASE_KEY_STORAGE = "sh_todo_base"
export const API_AUTH = import.meta.env.VITE_API_AUTH ?? "https://localhost:1338/api-auth/oauth"

export const ROOT_URL = "/todo-service"

export const authConfig = new Config(
    API_AUTH, 
    CLIENT_ID, 
    window.location.origin + `${ROOT_URL}/callback`, 
    `${ROOT_URL}/todos`, 
    BASE_KEY_STORAGE
)

export const authManager = new AuthManager(authConfig)