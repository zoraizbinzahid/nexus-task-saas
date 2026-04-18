"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export function Navbar() {
    return (
        <header className="h-16 border-b border-gray-800 bg-[#09090b] flex items-center justify-between px-6 sticky top-0 z-10">
        {/* Search Section */}
        <div className="flex items-center flex-1 max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-500" />
        <Input placeholder="Search..." className="pl-10 bg-[#1a1c23] border-gray-800 text-gray-200 focus:ring-blue-500 w-full" />    
        </div>    

        {/* Profile & Notifications */}
        <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
            </button>

        <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Zoraiz</p>
                <p className="text-xs text-gray-500">Admin</p>
            </div>
            <Avatar className="h-9 w-9 border border-gray-700">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white font-bold">Z</AvatarFallback>
            </Avatar>
        </div>
        </div>
        </header>
    )
}