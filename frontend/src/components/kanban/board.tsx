"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Blueprint for a task
interface Task {
  id: string
  title: string
  status: "todo" | "in-progress" | "done"
  priority: "High" | "Medium" | "Low"
  date: string
}

// Fake Data (temporary)
const mockTasks: Task[] = [
  { id: "1", title: "API Integration with Django", status: "todo", priority: "High", date: "Apr 20" },
  { id: "2", title: "Design Sidebar Navigation", status: "in-progress", priority: "Medium", date: "Apr 18" },
  { id: "3", title: "Setup Project Boilerplate", status: "done", priority: "Low", date: "Apr 15" },
]

// FIXED: Added Type definition to columns to prevent the filter error
const columns: { title: string; value: Task["status"] }[] = [
  { title: "To Do", value: "todo" },
  { title: "In Progress", value: "in-progress" },
  { title: "Done", value: "done" },
]

export function KanbanBoard() {
  return (
    /* Main Grid Wrapper - This creates the 3-column layout */
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {columns.map((column) => (
        <div key={column.value} className="flex flex-col gap-4">
          
          {/* Column Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-gray-200">{column.title}</h3>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full font-mono">
              {mockTasks.filter(t => t.status === column.value).length}
            </span>
          </div>

          {/* Task List Area */}
          <div className="flex flex-col gap-3 min-h-[500px] rounded-lg bg-gray-900/20 p-2">
            {mockTasks
              .filter((task) => task.status === column.value)
              .map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-[#1a1c23] border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg group">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0",
                          task.priority === "High" ? "text-red-400 border-red-900 bg-red-900/20" :
                          task.priority === "Medium" ? "text-orange-400 border-orange-900 bg-orange-900/20" :
                          "text-green-400 border-green-900 bg-green-900/20"
                      )}>
                        {task.priority}
                      </Badge>
                      <MoreHorizontal className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardTitle className="text-sm font-medium text-gray-200 mb-4 leading-relaxed">
                        {task.title}
                      </CardTitle>
                      <div className="flex items-center text-[11px] text-gray-500 gap-2">
                        <Calendar className="h-3 w-3" />
                        {task.date}
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