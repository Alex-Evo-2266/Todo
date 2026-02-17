// src/types/auth.ts
export interface AuthHeaders {
  authorization?: string;
  "x-status-auth"?: string;
  "x-forwarded-for"?: string;
  "x-user-id"?: string;
  "x-user-role"?: string;
  host?: string;
  "x-user-privilege"?: string;
}
