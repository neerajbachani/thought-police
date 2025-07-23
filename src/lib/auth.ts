import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // ✅ Explicitly set base URL for production
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    
  socialProviders: {
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      scope: ["identity", "read"],
      // ✅ Explicitly set redirect URI
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/reddit` || "http://localhost:3000/api/auth/callback/reddit"
    },
  },
  
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  callbacks: {
    async signIn() {
      return true
    },
    async session({ session, user }: { session: any, user: any }) {
      if (user) {
        session.user.id = user.id
        session.user.redditUsername = user.redditUsername
      }
      return session
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user