import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      scope: ["identity", "read"],
    },
  },
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async signIn() {
      // Custom sign-in logic if needed
      return true
    },
    async session({ session, user }: { session: any, user: any }) {
      // Add custom fields to session
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