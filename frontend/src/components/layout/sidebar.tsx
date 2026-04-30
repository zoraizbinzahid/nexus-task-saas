// src/components/layout/sidebar.tsx
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Clock, 
  Settings,
  Users,
  LogOut
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import type { NavItemProps } from "@/types/domain";

export default function Sidebar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout/");
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <aside className="w-72 bg-[#09090b] border-r border-gray-800 flex flex-col h-screen transition-all">
      
      {/* 🚀 Workspace Switcher Header */}
      <div className="p-6">
        <WorkspaceSwitcher />
      </div>

      {/* 📂 Professional Navigation Sections */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        
        <div>
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Core</p>
          <div className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              href="/"
              active={pathname === "/"}
            />
            <NavItem 
              icon={<FolderKanban size={20} />} 
              label="Projects" 
              href="/projects" 
              active={pathname === "/projects"}
            />
            <NavItem 
              icon={<Calendar size={20} />} 
              label="Calendar" 
              href="/calendar" 
              active={pathname === "/calendar"}
            />
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Management</p>
          <div className="space-y-1">
            <NavItem icon={<Users size={20} />} label="Members" href="/members" active={pathname === "/members"} />
            <NavItem icon={<Settings size={20} />} label="Settings" href="/settings" />
          </div>
        </div>
      </nav>

      {/* 🕒 Professional Infrastructure: System Clock & Footer */}
      <div className="p-4 mt-auto border-t border-gray-800 bg-[#0c0c0e]">
        <div className="bg-[#1a1c23] border border-gray-800 p-4 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center gap-2 text-blue-500/80 mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-[0.15em] font-black">System Live</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
            {time}
          </div>
          {/* Subtle background glow */}
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-2xl rounded-full group-hover:bg-blue-600/10 transition-all"></div>
        </div>

        <button onClick={handleLogout} className="w-full mt-4 flex items-center gap-3 p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
          <LogOut size={18} />
          <span className="text-sm font-medium">End Session</span>
        </button>
      </div>
    </aside>
  );
}

// ✅ 4. Internal Component with proper TypeScript Types
function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
        ${active 
          ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
          : "text-gray-400 hover:text-white hover:bg-[#1a1c23]"
        }
      `}
    >
      <span className={`${active ? "text-blue-500" : "text-gray-500 group-hover:text-blue-400"} transition-colors`}>
        {icon}
      </span>
      <span className="text-sm font-medium tracking-tight">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
      )}
    </Link>
  );
}