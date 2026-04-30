"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Calendar, CheckCircle2, Clock } from "lucide-react";
import type { ApiError, Task } from "@/types/domain";

export default function TaskPage() {
    const searchParams = useSearchParams();
    const searchQuery = (searchParams.get("q") || "").toLowerCase();
    const [tasks, setTasks] = useState<Task[]>([]);
    const visibleTasks = searchQuery
        ? tasks.filter((task) => task.title.toLowerCase().includes(searchQuery))
        : tasks;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Fetching from your GET /api/tasks/ endpoint
                const res = await api.get<Task[]>("/tasks/");
                
                // ✅ Safety Sort: Handle null deadlines so the app doesn't crash
                const sorted = res.data.sort((a, b) => {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                });
                
                setTasks(sorted);
            } catch (err: unknown) {
                const apiError = err as ApiError;
                if (apiError.response?.status !== 401) {
                    toast.error("Failed to load your tasks");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // ✅ Match the CSS to your PRIORITY_CHOICES in models.py
    const getPriorityStyle = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'HIGH': return "text-red-400 bg-red-400/10 border-red-400/20";
            case 'MEDIUM': return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case 'LOW': return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-800";
        }
    };

    // ✅ Match the Label to your STATUS_CHOICES in models.py
    const formatStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'TODO': 'To Do',
            'IN_PROGRESS': 'In Progress',
            'DONE': 'Done'
        };
        return statusMap[status.toUpperCase()] || status;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0b0c10]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 text-white min-h-screen bg-[#0b0c10]">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
                <p className="text-gray-400 mt-2">Manage your workflow and deadlines.</p>
            </header>

            <div className="grid gap-4">
                {visibleTasks.map((task) => (
                    <div 
                        key={task.id} 
                        className="bg-[#1a1c23] border border-gray-800 p-5 rounded-2xl flex items-center justify-between hover:border-gray-700 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-900 rounded-xl group-hover:bg-blue-600/10 transition-colors">
                                {task.status === 'DONE' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Clock className="w-5 h-5 text-blue-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                    <span>{formatStatus(task.status)}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                        </div>
                    </div>
                ))}

                {visibleTasks.length === 0 && (
                    <div className="text-center py-20 bg-[#1a1c23] rounded-3xl border border-dashed border-gray-800">
                        <p className="text-gray-500">No tasks found for your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}