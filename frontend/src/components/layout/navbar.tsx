"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

export function Navbar() {
  const [username, setUsername] = useState("Guest")

  useEffect(() => {
    // 🔑 Fetch real user from Django
    api.get("/auth/user/")
      .then(res => {
        // If username exists, use it; otherwise, grab the part before the '@' in the email
        const displayName = res.data.username || (res.data.email ? res.data.email.split('@')[0] : "User")
        setUsername(displayName)
      })
      .catch(() => setUsername("Guest User"))
  }, [])

  return (
    <header className="h-16 border-b border-gray-800 bg-[#09090b] flex items-center justify-between px-6 sticky top-0 z-10">
      
      {/* Search Section */}
      <div className="flex items-center flex-1 max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search..." 
          className="pl-10 bg-[#1a1c23] border-gray-800 text-gray-200 focus:ring-blue-500 w-full" 
        />    
      </div>    

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
          <div className="text-right hidden sm:block">
            {/* capitalize makes names look professional even if typed in lowercase */}
            <span className="text-sm font-medium text-white capitalize">{username}</span>
            <p className="text-xs text-gray-500 font-mono">Workspace Admin</p>
          </div>
          
          <Avatar className="h-9 w-9 border border-gray-700">
            <AvatarImage src="" /> {/* Add user profile pic URL here later */}
            <AvatarFallback className="bg-blue-600 text-white font-bold uppercase">
              {/* This grabs the first letter of whatever name we have */}
              {username.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}