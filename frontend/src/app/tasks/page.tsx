"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

// Type Safety: No more 'any' errors
interface Task {
    id: number;
    title: string;
    priority: string;
    status: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get<Task[]>("/tasks/")
            .then(res => setTasks(res.data))
            .catch(() => toast.error("Failed to load task list"))
            .finally(() => setIsLoading(false));
    }, []);

    const getPriorityStyle = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return "text-red-400 bg-red-400/10 border-red-400/20";
            case 'medium': return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            default: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#0b0c10]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
                    <p className="text-gray-400 mt-1">A central view of every task in your workspace.</p>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#1a1c23]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-800 text-gray-400 text-sm">
                                <th className="p-4 font-medium uppercase tracking-wider">Task Name</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Status</th>
                                <th className="p-4 font-medium uppercase tracking-wider">Priority</th>
                                <th className="p-4 font-medium uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-800/40 transition-colors group">
                                    <td className="p-4 font-medium text-gray-200">{task.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-md border border-gray-700 bg-gray-900 text-xs uppercase text-gray-400">
                                            {task.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md border text-xs font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-500 hover:text-blue-400 transition-colors text-sm font-semibold">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {tasks.length === 0 && !isLoading && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-4 text-gray-500">
                            📂
                        </div>
                        <h3 className="text-lg font-medium text-gray-300">The vault is empty</h3>
                        <p className="text-gray-500 max-w-xs mt-1">No tasks have been assigned to this workspace yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}