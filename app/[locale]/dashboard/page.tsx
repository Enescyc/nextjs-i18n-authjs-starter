import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { parseLocaleParams } from "@/lib/i18n/server"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const locale = await parseLocaleParams(params);
  const session = await auth()
  const t = await getTranslations({locale, namespace: 'Dashboard'})
  
  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('welcome', { name: session.user.name || session.user.email || 'User' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('loggedInAs', { role: session.user.role.toLowerCase() })}
            </p>
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback className="text-lg">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{session.user.name}</p>
                <p className="text-muted-foreground">{session.user.email}</p>
                <Badge variant={session.user.role === Role.ADMIN ? "default" : "secondary"} className="mt-1">
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {session.user.role === Role.ADMIN && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">{t('adminAccess')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                {t('adminPrivileges')}
              </p>
              <Button asChild variant="default">
                <Link href="/admin">{t('goToAdminPanel')}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}