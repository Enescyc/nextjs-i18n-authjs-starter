import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { getAllAdmins } from "@/lib/role-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import { parseLocaleParams } from "@/lib/i18n/server"

export const dynamic = 'force-dynamic'

export default async function AdminPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const locale = await parseLocaleParams(params);
  const session = await auth()
  const t = await getTranslations({locale, namespace: 'Admin'})
  
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/")
  }

  let admins: Awaited<ReturnType<typeof getAllAdmins>> = []
  try {
    admins = await getAllAdmins()
  } catch (error) {
    console.error("Failed to load admins:", error)
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
            <p className="text-muted-foreground">{t('adminAccessMessage')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('adminUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={admin.image || ""} alt={admin.name || "Admin"} />
                      <AvatarFallback>
                        {admin.name?.charAt(0) || admin.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <Badge variant="default">{t('adminRole')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}