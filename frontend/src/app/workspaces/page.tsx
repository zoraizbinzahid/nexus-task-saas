"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { ApiError, Workspace } from "@/types/domain";
import { addAppNotification } from "@/lib/notifications";

export default function WorkspacesPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        api.get<Workspace[]>("/workspaces/")
            .then(res => {
                setWorkspaces(res.data);
            })
            .catch((err: unknown) => {
                const apiError = err as ApiError;
                if (apiError.response?.status !== 401) {
                toast.error("Failed to load workspaces.");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const createWorkspace = async () => {
        if (!name.trim()) return;
        setIsCreating(true);
        try {
            const res = await api.post<Workspace>("/workspaces/", { name: name.trim() });
            setWorkspaces((prev) => [...prev, res.data]);
            setName("");
            toast.success("Workspace created");
            addAppNotification(`Workspace "${res.data.name}" created.`);
        } catch {
            toast.error("Could not create workspace");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#0b0c10]">
            <h1 className="text-3xl font-bold mb-6">Your Workspaces</h1>
            <div className="mb-6 flex gap-2 max-w-md">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Workspace name"
                    className="flex-1 bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
                />
                <button
                    onClick={createWorkspace}
                    disabled={isCreating}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold disabled:opacity-60"
                >
                    {isCreating ? "Creating..." : "Make Workspace"}
                </button>
            </div>
            
            {isLoading ? (
                <div className="text-gray-500">Loading your engine...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    
                </div>
            )}
        </div>
    );
}