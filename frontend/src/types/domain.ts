import type { ReactNode } from "react";

export interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
}

export interface Workspace {
  id: number;
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  workspace: number;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  project: number;
  assignee: number | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: number;
  workspace: number;
  user: number;
  user_email: string;
  user_username: string | null;
  role: "ADMIN" | "MEMBER";
}

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}
