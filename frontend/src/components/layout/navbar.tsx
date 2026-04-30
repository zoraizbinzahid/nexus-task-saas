"use client"

import { Search, Bell, LogOut, ChevronDown } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAppNotifications, type AppNotification } from "@/lib/notifications"

// 1. Define exactly what a User looks like
interface User {
  username: string;
  email: string;
}

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showLogout, setShowLogout] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [query, setQuery] = useState("")
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    api.get<User>("/auth/user/") // 3. Tell the API to expect User data
      .then(res => setUser(res.data))
      .catch(() => setUser(null))

    const loadNotifications = () => setNotifications(getAppNotifications())
    loadNotifications()
    window.addEventListener("nexus:notification:new", loadNotifications)
    return () => window.removeEventListener("nexus:notification:new", loadNotifications)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout/")
      window.location.href = "/login"
    } catch (err) {
      window.location.href = "/login"
    }
  }

  const handleSearch = () => {
    const value = query.trim()
    if (!value) return
    router.push(`/tasks?q=${encodeURIComponent(value)}`)
  }

  return (
    <header className="h-16 border-b border-gray-800 bg-[#09090b] flex items-center justify-between px-6 sticky top-0 z-10">
      
      <div className="flex items-center flex-1 max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
          className="pl-10 bg-[#1a1c23] border-gray-800 text-gray-200 focus:ring-blue-500 w-full" 
        />    
      </div>    

      <div className="flex items-center gap-4">
        <button onClick={() => setShowNotifications((v) => !v)} className="p-2 text-gray-400 hover:text-white transition-colors relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 ? (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-blue-600 text-[10px] text-white px-1">
              {Math.min(notifications.length, 9)}
            </span>
          ) : null}
        </button>
        {showNotifications ? (
          <div className="absolute top-14 right-24 w-80 bg-[#1a1c23] border border-gray-800 rounded-lg shadow-xl p-3 z-50">
            <p className="text-xs text-gray-400 mb-2">Notifications</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {notifications.length === 0 ? <p className="text-sm text-gray-500">No notifications yet.</p> : null}
              {notifications.map((note) => (
                <div key={note.id} className="rounded-md border border-gray-800 p-2">
                  <p className="text-sm text-gray-200">{note.message}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 border-l border-gray-800 pl-4 relative">
          {!user ? (
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium transition-all"
            >
              Login
            </Link>
          ) : (
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowLogout(!showLogout)}
            >
              <div className="text-right hidden sm:block">
                <span className="text-sm font-medium text-white capitalize">
                  {user.username || user.email.split('@')[0]}
                </span>
                <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                  Admin <ChevronDown className="h-2 w-2" />
                </p>
              </div>
              
              <Avatar className="h-9 w-9 border border-gray-700">
                <AvatarFallback className="bg-blue-600 text-white font-bold uppercase">
                  {(user.username || user.email).charAt(0)}
                </AvatarFallback>
              </Avatar>

              {showLogout && (
                <div className="absolute top-12 right-0 w-40 bg-[#1a1c23] border border-gray-800 rounded-lg shadow-xl py-1 z-50">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}