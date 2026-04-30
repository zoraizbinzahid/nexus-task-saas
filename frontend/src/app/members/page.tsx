"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Workspace, WorkspaceMember } from "@/types/domain";
import { toast } from "sonner";
import { addAppNotification } from "@/lib/notifications";

export default function MembersPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  useEffect(() => {
    api.get<Workspace[]>("/workspaces/")
      .then((res) => {
        setWorkspaces(res.data);
        if (res.data.length > 0) setSelectedWorkspaceId(String(res.data[0].id));
      })
      .catch(() => {
        setWorkspaces([]);
        toast.error("Could not load workspaces.");
      });
  }, []);

  useEffect(() => {
    if (!selectedWorkspaceId) return;
    api
      .get<WorkspaceMember[]>(`/workspaces/${selectedWorkspaceId}/members/`)
      .then((res) => setMembers(res.data))
      .catch(() => {
        setMembers([]);
        toast.error("Could not load members for this workspace.");
      });
  }, [selectedWorkspaceId]);

  const addMember = async () => {
    if (!email.trim() || !selectedWorkspaceId) return;
    try {
      await api.post(`/workspaces/${selectedWorkspaceId}/members/`, { email: email.trim(), role });
      const res = await api.get<WorkspaceMember[]>(`/workspaces/${selectedWorkspaceId}/members/`);
      setMembers(res.data);
      setEmail("");
      setRole("MEMBER");
      toast.success("Member access updated");
      addAppNotification(`Member ${email.trim()} added as ${role}.`);
    } catch {
      toast.error("Could not add member. Make sure you are workspace admin.");
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#09090b]">
      <h1 className="text-3xl font-bold mb-6">Workspace Members</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={selectedWorkspaceId}
          onChange={(e) => setSelectedWorkspaceId(e.target.value)}
          className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
        >
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={String(workspace.id)}>
              {workspace.name}
            </option>
          ))}
        </select>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@email.com"
          className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
          className="bg-[#1a1c23] border border-gray-800 rounded-lg px-3 py-2"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button onClick={addMember} className="px-4 py-2 rounded-lg bg-blue-600 font-semibold">
          Give Access
        </button>
      </div>

      <div className="space-y-3">
        {workspaces.length === 0 ? <p className="text-gray-500">Create a workspace first to manage members.</p> : null}
        {members.length === 0 && workspaces.length > 0 ? <p className="text-gray-500">No members found in this workspace.</p> : null}
        {members.map((member) => (
          <div key={member.id} className="p-4 bg-[#1a1c23] border border-gray-800 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">{member.user_username || member.user_email}</p>
              <p className="text-xs text-gray-500">{member.user_email}</p>
            </div>
            <span className="px-2 py-1 rounded bg-blue-600/15 text-blue-400 text-xs font-semibold">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
