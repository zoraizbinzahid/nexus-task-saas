"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, FolderKanban, CheckSquare, Calendar, Settings, Plus } from "lucide-react"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { CreateTaskModal } from "../kanban/create-task-modal"
import { cn } from "@/lib/utils"

const navItems = [
    {name: "Dashboard", href: "/", icon: LayoutDashboard},
    {name: "Workspaces", href: "/workspaces", icon: Briefcase},
    {name: "Projects", href: "/projects", icon: FolderKanban},
    {name: "Task", href: "/tasks", icon: CheckSquare},
    {name: "Calendar", href: "/calendar", icon: Calendar},
    {name: "Settings", href: "/settings", icon: Settings},
]

export function Sidebar(){
    const pathname = usePathname()

    return (
      <div className="flex h-full w-64 flex-col bg-[#0f1117] text-gray-400 border-r border-gray-800">
        
        {/* 1. LOGO SECTION */}
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NEXUS</span>
          </div>
        </div>

        {/* 2. WORKSPACE SWITCHER (The new part!) */}
        <div className="px-4 mb-4">
          <WorkspaceSwitcher />
        </div>

        {/* 3. NAVIGATION LINKS */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-gray-800 text-white" 
                    : "hover:bg-gray-800/50 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-500" : "group-hover:text-blue-500"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* 4. BOTTOM ACTION BUTTON */}
        {/* 4. BOTTOM ACTION BUTTON */}
        <div className="p-4 border-t border-gray-800">
          <CreateTaskModal />
        </div>
      </div>
    )
}