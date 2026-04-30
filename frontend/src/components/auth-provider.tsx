"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import api from "@/lib/axios"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/user/") // Verify cookie with Django
        setAuthorized(true)
      } catch (err) {
        if (pathname !== "/login" && pathname !== "/register") {
          router.push("/login")
        }
      }
    }
    checkAuth()
  }, [pathname, router])

  return authorized || pathname === "/login" || pathname === "/register" ? <>{children}</> : null
}