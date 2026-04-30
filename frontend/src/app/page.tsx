"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2, LayoutDashboard, Plus } from "lucide-react";
import type { ApiError, Workspace } from "@/types/domain";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addAppNotification } from "@/lib/notifications";

export default function Home() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const getWorkspaceData = async () => {
      try {
        const res = await api.get<Workspace[]>("/workspaces/");
        setWorkspaces(res.data);
      } catch (err: unknown) {
        const apiError = err as ApiError;
        if (apiError.response?.status !== 401) {
          console.warn("Dashboard note: Workspace fetch skipped (User likely logged out).");
        }
      } finally {
        setLoading(false);
      }
    };

    getWorkspaceData();
  }, []);

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post<Workspace>("/workspaces/", { name: newWorkspaceName.trim() });
      setWorkspaces((prev) => [...prev, res.data]);
      setNewWorkspaceName("");
      toast.success("Workspace created");
      addAppNotification(`Workspace "${res.data.name}" created.`);
    } finally {
      setIsCreating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Initialising Nexus Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight capitalize">
            Nexus Dashboard
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Aggregate view across all workspaces
          </p>
        </div>
        
        <div className="hidden md:block p-3 bg-gray-900/50 rounded-xl border border-gray-800">
           <LayoutDashboard className="h-5 w-5 text-blue-500" />
        </div>
      </div>
      
      {workspaces.length === 0 ? (
        <div className="h-[320px] flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/20 gap-4">
          <p className="text-gray-400 text-sm">No workspace found. Create your first workspace to start managing projects and tasks.</p>
          <div className="flex gap-2">
            <input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={createWorkspace} disabled={isCreating} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">
              {isCreating ? "Creating..." : "Make Workspace"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => router.push("/projects")}
              className="text-left p-5 bg-[#1a1c23] border border-gray-800 rounded-xl hover:border-blue-500 transition-all"
            >
              <p className="text-lg font-semibold">{workspace.name}</p>
              <p className="text-xs text-gray-500 mt-1">/{workspace.slug}</p>
            </button>
          ))}
          <button onClick={() => router.push("/workspaces")} className="p-5 border-2 border-dashed border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-blue-500 transition-all flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Make Workspace
          </button>
        </div>
      )}
    </div>
  )
}