import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()

export async function promoteToAdmin(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN }
    })
    return !!user
  } catch (error) {
    console.error("Failed to promote user to admin:", error)
    return false
  }
}

export async function demoteFromAdmin(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: Role.USER }
    })
    return !!user
  } catch (error) {
    console.error("Failed to demote user from admin:", error)
    return false
  }
}

export async function getUserRole(email: string): Promise<Role | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })
    return user?.role || null
  } catch (error) {
    console.error("Failed to get user role:", error)
    return null
  }
}

export async function isAdmin(email: string): Promise<boolean> {
  const role = await getUserRole(email)
  return role === Role.ADMIN
}

export async function getAllAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true
      }
    })
    return admins
  } catch (error) {
    console.error("Failed to get all admins:", error)
    return []
  }
}