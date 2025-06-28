"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

export function useRole() {
  const { data: session, status } = useSession()
  
  return {
    session,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === Role.ADMIN,
    isUser: session?.user?.role === Role.USER,
    role: session?.user?.role,
    hasRole: (role: Role) => session?.user?.role === role,
    hasAnyRole: (roles: Role[]) => roles.includes(session?.user?.role as Role),
  }
}