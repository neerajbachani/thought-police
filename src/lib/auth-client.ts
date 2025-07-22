import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production' 
    ? "https://your-domain.com" 
    : "http://localhost:3000",
})

export const { 
  signIn, 
  signOut, 
  useSession,
  getSession 
} = authClient