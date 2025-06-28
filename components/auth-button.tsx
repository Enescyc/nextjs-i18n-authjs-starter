"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function AuthButton() {
  const { data: session, status } = useSession()
  const t = useTranslations('Auth')
  const tCommon = useTranslations('Common')

  if (status === "loading") {
    return <div>{tCommon('loading')}</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
            <AvatarFallback>
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{session.user.name}</p>
            <Badge variant={session.user.role === Role.ADMIN ? "default" : "secondary"}>
              {session.user.role}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          {session.user.role === Role.ADMIN && (
            <Button asChild variant="default" size="sm">
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <Button 
            onClick={() => signOut()}
            variant="destructive" 
            size="sm"
          >
            {t('signOut')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn("google")}>
      {t('signIn')}
    </Button>
  )
}