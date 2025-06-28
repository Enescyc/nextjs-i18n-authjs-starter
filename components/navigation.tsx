"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"

export function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              VocAgent
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                
                {session.user.role === Role.ADMIN && (
                  <Link 
                    href="/admin" 
                    className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <Image 
                    src={session.user.image || "/default-avatar.png"} 
                    alt={session.user.name || "User"} 
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-700">{session.user.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.user.role === Role.ADMIN 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {session.user.role}
                  </span>
                </div>
              </>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}