import { KanbanBoard } from "@/components/kanban/board";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Global Team</h1>
        <p className="text-gray-500 mt-1">Project: Launch Phase 1</p>
      </div>
      
      {/* The Kanban Board Component */}
      <KanbanBoard />
    </div>
  )
}