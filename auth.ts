import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow account linking with same email
    }),
  ],
  session: {
    strategy: "database", // Use database strategy with Prisma adapter
  },
  callbacks: {
    session: async ({ session, user }) => {
      // With database sessions, user object contains the database user
      if (session?.user && user) {
        session.user.id = user.id
        session.user.role = (user as any).role as Role
      }
      return session
    },
    signIn: async ({ user, account, profile }) => {
      // Check if user should be admin and update their role
      if (user.email) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        const isAdmin = adminEmails.includes(user.email)
        
        if (isAdmin) {
          try {
            // Update the user role to admin if they're in the admin emails list
            await prisma.user.upsert({
              where: { email: user.email },
              update: { role: Role.ADMIN },
              create: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: Role.ADMIN
              }
            })
          } catch (error) {
            console.error('Error updating user role:', error)
          }
        }
      }
      
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})