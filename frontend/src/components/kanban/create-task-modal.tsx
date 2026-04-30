"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import api from "@/lib/axios" 
import type { ApiError, Project, WorkspaceMember } from "@/types/domain"
import { toast } from "sonner"
import { addAppNotification } from "@/lib/notifications"

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
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO")
  const [projectId, setProjectId] = useState<string>("")
  const [projects, setProjects] = useState<Project[]>([])
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([])
  const [assigneeId, setAssigneeId] = useState<string>("")
  const [deadline, setDeadline] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    api
      .get<Project[]>("/projects/")
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    const selectedProject = projects.find((project) => String(project.id) === projectId)
    if (!selectedProject) {
      setWorkspaceMembers([])
      setAssigneeId("")
      return
    }

    api
      .get<WorkspaceMember[]>(`/workspaces/${selectedProject.workspace}/members/`)
      .then((res) => setWorkspaceMembers(res.data))
      .catch(() => setWorkspaceMembers([]))
  }, [projectId, projects])

  const handleSave = async () => {
    if (!title) return alert("Please enter a task name")
    if (!projectId) return alert("Please select a project")
    
    setIsLoading(true)
    try {
      await api.post("/tasks/", {
        title,
        description: description || null,
        priority,
        status,
        project: Number(projectId),
        assignee: assigneeId ? Number(assigneeId) : null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      })
      toast.success("Task created")
      addAppNotification(`Task "${title}" created${assigneeId ? " and assigned." : "."}`)
      window.location.reload() 
    } catch (error: unknown) {
      const backendError = (error as ApiError).response?.data
      toast.error(`Error: ${JSON.stringify(backendError ?? "Unexpected error occurred.")}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePriorityChange = (value: string) => {
    if (value === "LOW" || value === "MEDIUM" || value === "HIGH") {
      setPriority(value)
    }
  }

  const handleStatusChange = (value: string) => {
    if (value === "TODO" || value === "IN_PROGRESS" || value === "DONE") {
      setStatus(value)
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
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="bg-[#0f1117] border-gray-800">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional details"
              className="bg-[#0f1117] border-gray-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="bg-[#0f1117] border-gray-800">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                  {workspaceMembers.map((member) => (
                    <SelectItem key={member.id} value={String(member.user)}>
                      {member.user_username || member.user_email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                className="bg-[#0f1117] border-gray-800"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="bg-[#0f1117] border-gray-800">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-[#0f1117] border-gray-800">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1c23] border-gray-800 text-white">
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
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