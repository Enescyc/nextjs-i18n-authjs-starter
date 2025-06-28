"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: Role[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return fallback || <div>Access denied</div>
  }

  return <>{children}</>
}

interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

interface AuthenticatedOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthenticatedOnly({ children, fallback }: AuthenticatedOnlyProps) {
  return (
    <RoleGuard allowedRoles={[Role.USER, Role.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}