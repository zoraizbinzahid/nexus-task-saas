"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Define the shape of our Task
interface Task {
  id: string
  title: string
  status: "todo" | "in-progress" | "done"
  priority: "High" | "Medium" | "Low"
  created_at: string 
}

const columns: { title: string; value: Task["status"] }[] = [
  { title: "To Do", value: "todo" },
  { title: "In Progress", value: "in-progress" },
  { title: "Done", value: "done" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks/")
        setTasks(Array.isArray(response.data) ? response.data : [])
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number } };

        if (axiosError.response?.status === 401) {
          console.warn("Nexus: Unauthorized access to tasks.");
        } else {
          console.error("Nexus API Error:", error);
        }
        setTasks([]) 
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-gray-400 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="font-mono text-sm uppercase tracking-widest text-blue-400/80">Synchronizing Nexus...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {columns.map((column) => (
        <div key={column.value} className="flex flex-col gap-4">
          {/* Column Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-gray-200">{column.title}</h3>
            
            {/* Real-time Task Count */}
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full font-mono">
              {tasks.filter(t => t?.status === column.value).length}
            </span>
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-3 min-h-[500px] rounded-lg bg-gray-900/10 p-2 border border-dashed border-gray-800/50">
            {tasks
              .filter((task) => task?.status === column.value)
              .map((task) => (
                <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-[#1a1c23] border-gray-800 hover:border-blue-500/40 transition-all cursor-pointer shadow-lg group">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0",
                          task.priority === "High" ? "text-red-400 border-red-900/50 bg-red-900/20" :
                          task.priority === "Medium" ? "text-orange-400 border-orange-900/50 bg-orange-900/20" :
                          "text-green-400 border-green-900/50 bg-green-900/20"
                      )}>
                        {task.priority || "Low"}
                      </Badge>
                      <MoreHorizontal className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      <CardTitle className="text-sm font-medium text-gray-200 mb-4 line-clamp-2">
                        {task.title || "Untitled Task"}
                      </CardTitle>
                      
                      <div className="flex items-center text-[11px] text-gray-500 gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {task.created_at 
                            ? new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : "No Date"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}