"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Building2 } from "lucide-react"

import { cn } from "@/lib/utils"
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

const workspaces = [
  { label: "Global Team", value: "global-team" },
  { label: "Marketing Dept", value: "marketing" },
  { label: "Personal Tasks", value: "personal" },
]

export function WorkspaceSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(workspaces[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The Button the user sees in the sidebar */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between bg-[#1a1c23] border-gray-800 text-gray-200 hover:bg-gray-800"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="truncate">{selectedWorkspace.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* The Menu that pops out */}
      <PopoverContent className="w-64 p-0 bg-[#1a1c23] border-gray-800">
        <Command className="bg-[#1a1c23]">
          <CommandInput placeholder="Search workspace..." />
          <CommandList className="text-gray-200">
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.value}
                  onSelect={() => {
                    setSelectedWorkspace(workspace)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {workspace.label}
                  </div>
                  {/* Shows a Checkmark only if this is the active workspace */}
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedWorkspace.value === workspace.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <CommandSeparator />
          
          <CommandList>
            <CommandGroup>
              <CommandItem className="cursor-pointer text-blue-400">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Workspace
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}