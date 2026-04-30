"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Building2 } from "lucide-react"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { ApiError, Workspace } from "@/types/domain"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function WorkspaceSwitcher() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace | null>(null)

  React.useEffect(() => {
    api.get<Workspace[]>("/workspaces/")
      .then(res => {
        setWorkspaces(res.data)
        if (res.data.length > 0) {
          setSelectedWorkspace(res.data[0])
        }
      })
      .catch((err: unknown) => {
        const apiError = err as ApiError
        if (apiError.response?.status !== 401) {
          console.error("Workspace Sync Error:", err)
        }
      })
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-[#1a1c23] border-gray-800 text-gray-200 hover:bg-gray-800"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {workspaces.length > 0 
                ? (selectedWorkspace?.name || "Select Workspace") 
                : "No Workspaces Found"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 bg-[#1a1c23] border-gray-800 shadow-2xl">
        <Command className="bg-[#1a1c23]">
          <CommandInput placeholder="Search workspace..." className="text-white border-none focus:ring-0" />
          <CommandList className="text-gray-200 max-h-[300px] overflow-y-auto">
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="My Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() => {
                    setSelectedWorkspace(workspace)
                    setOpen(false)
                    // If you want the page to update immediately, add:
                    // window.location.reload(); 
                  }}
                  className="flex items-center justify-between cursor-pointer py-3 px-4 aria-selected:bg-gray-800 aria-selected:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate max-w-[140px]">{workspace.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 text-blue-500",
                      selectedWorkspace?.id === workspace.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <CommandSeparator className="bg-gray-800" />
          
          <CommandList>
            <CommandGroup>
              <CommandItem 
                onSelect={() => {
                   setOpen(false)
                   router.push("/workspaces")
                }} 
                className="cursor-pointer text-blue-400 hover:text-blue-300 py-3 px-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Manage Workspaces
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}