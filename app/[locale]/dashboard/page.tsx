import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, {session.user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You are logged in as a {session.user.role.toLowerCase()}.
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
              <CardTitle className="text-yellow-800">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                You have administrative privileges. You can access the admin panel.
              </p>
              <Button asChild variant="default">
                <Link href="/admin">Go to Admin Panel</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}