"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import type { Project, Workspace } from "@/types/domain"
import { toast } from "sonner"
import { addAppNotification } from "@/lib/notifications"

export default function ProjectsPage() {
    const searchParams = useSearchParams()
    const searchQuery = (searchParams.get("q") || "").toLowerCase()
    const [projects, setProjects] = useState<Project[]>([])
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [newProjectName, setNewProjectName] = useState("")

    useEffect(() => {
        Promise.all([
            api.get<Project[]>("/projects/"),
            api.get<Workspace[]>("/workspaces/"),
        ])
            .then(([projectRes, workspaceRes]) => {
                setProjects(projectRes.data)
                setWorkspaces(workspaceRes.data)
                if (workspaceRes.data.length > 0) {
                    setSelectedWorkspace(String(workspaceRes.data[0].id))
                }
            })
            .catch(() => console.log("No projects found"))
            .finally(() => setLoading(false))
    }, [])

    const createProject = async () => {
        if (!newProjectName.trim() || !selectedWorkspace) return
        try {
            const res = await api.post<Project>("/projects/", {
                name: newProjectName.trim(),
                workspace: Number(selectedWorkspace),
                description: "",
            })
            setProjects((prev) => [...prev, res.data])
            setNewProjectName("")
            toast.success("Project created")
            addAppNotification(`Project "${res.data.name}" created.`)
        } catch {
            toast.error("Could not create project")
        }
    }

    const filteredProjects = selectedWorkspace
        ? projects.filter((project) => String(project.workspace) === selectedWorkspace)
        : projects
    const searchedProjects = searchQuery
        ? filteredProjects.filter((project) => project.name.toLowerCase().includes(searchQuery))
        : filteredProjects

    return (
        <div className="p-8 text-white bg-[#0b0c10] min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            <div className="mb-6 flex flex-wrap gap-2">
                <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
                >
                    {workspaces.map((workspace) => (
                        <option key={workspace.id} value={String(workspace.id)}>
                            {workspace.name}
                        </option>
                    ))}
                </select>
                <input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
                />
                <button onClick={createProject} className="px-4 py-2 bg-blue-600 rounded-lg font-semibold">
                    Create Project
                </button>
            </div>
            {loading ? <p className="text-gray-500">Loading projects...</p> : null}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {searchedProjects.map(project => (
                    <div key={project.id} className="p-6 bg-[#1a1c23] border border-gray-800 rounded-xl hover:border-blue-500 transition-all">
                        <h2 className="text-xl font-semibold">{project.name}</h2>
                        <p className="text-gray-400 text-sm mt-2">{project.description || "No description"}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}