"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import api from "@/lib/axios" 
import axios from "axios" // Import axios to use for type checking

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CreateTaskModal() {
  // STATE
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("todo")
  const [isLoading, setIsLoading] = useState(false)

  // 2. LOGIC
  const handleSave = async () => {
    if (!title) return alert("Please enter a task name")
    
    setIsLoading(true)
    try {
      // Deep Research Note: Ensure your Django serializer matches these keys exactly
      await api.post("/tasks/", {
        title: title,
        priority: priority.toUpperCase(), // Django ChoiceFields usually expect uppercase or specific slugs
        status: status,
      })
      
      window.location.reload() 
    } catch (error: unknown) {
      // FIXING THE 'ANY' RED LINE:
      if (axios.isAxiosError(error)) {
        console.error("Backend Error:", error.response?.data)
        alert(`Error: ${JSON.stringify(error.response?.data)}`)
      } else {
        console.error("Unexpected Error:", error)
        alert("An unexpected error occurred.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-[#1a1c23] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Task Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Design Login Page" 
              className="bg-[#0f1117] border-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-[#0f1117] border-gray-800">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-[#0f1117] border-gray-800">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isLoading ? "Saving..." : "Save Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}