"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

// 1. Define exactly what a Workspace looks like from your Django backend
interface Workspace {
    id: number | string;
    name: string;
    slug: string;
    description?: string;
}

export default function WorkspacesPage() {
    // 2. Tell the state it will hold an Array of Workspaces
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get<Workspace[]>("/workspaces/")
            .then(res => {
                setWorkspaces(res.data);
            })
            .catch(() => {
                toast.error("Failed to load workspaces.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="p-8 text-white min-h-screen bg-[#0b0c10]">
            <h1 className="text-3xl font-bold mb-6">Your Workspaces</h1>
            
            {isLoading ? (
                <div className="text-gray-500">Loading your engine...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 3. No 'any' needed! TS now knows 'ws' is a Workspace */}
                    {workspaces.map((ws) => (
                        <div 
                            key={ws.id} 
                            className="p-6 bg-[#1a1c23] border border-gray-800 rounded-xl hover:border-blue-500 transition-all cursor-pointer group"
                        >
                            <h2 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                                {ws.name}
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 font-mono">
                                /{ws.slug}
                            </p>
                        </div>
                    ))}
                    
                    <div className="p-6 border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 transition-all cursor-pointer">
                        + New Workspace
                    </div>
                </div>
            )}
        </div>
    );
}