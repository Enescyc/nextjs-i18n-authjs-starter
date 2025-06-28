import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      // On first sign in, user object is available
      if (user) {
        token.uid = user.id
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        })
        token.role = dbUser?.role || Role.USER
      }
      
      // On token refresh or update, re-fetch role from database
      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true }
        })
        token.role = dbUser?.role || Role.USER
      }
      
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        // Set role for new users
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        const isAdmin = adminEmails.includes(user.email!)
        
        // Update user role if needed
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            role: isAdmin ? Role.ADMIN : Role.USER
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: isAdmin ? Role.ADMIN : Role.USER
          }
        })
      }
      return true
    },
  },
  pages: {
    error: '/auth/error',
  },
}