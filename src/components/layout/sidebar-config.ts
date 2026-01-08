import {
  LayoutDashboard,
  Clock,
  ClipboardList,
  CheckSquare,
  DollarSign,
  Tag,
  Folder,
  Settings,
  Building2,
} from "lucide-react";

export const getNavigation = (t: any) => [
  { name: t.dashboard, href: "/", icon: LayoutDashboard },
  { name: t.attendance, href: "/attendance", icon: Clock },
  { name: t.attendanceLog, href: "/attendance-log", icon: ClipboardList },
  { name: t.taskAssignment, href: "/task-assignment", icon: CheckSquare },
  { name: t.reimbursement, href: "/reimbursement", icon: DollarSign },
  {
    name: t.reimbursementMgmt,
    href: "/reimbursement-management",
    icon: Settings,
  },
  {
    name: t.projectMgmt,
    href: "/project-management",
    icon: Folder,
  },
  {
    name: t.organizationMgmt,
    href: "/organization-management",
    icon: Building2,
  },
  {
    name: t.taskManagerMgr,
    href: "/task-manager",
    icon: ClipboardList,
  },

  { name: t.myTask, href: "/my-task", icon: Tag },
];

export const roleAccess: Record<string, string[]> = {
  Executive: ["/task-assignment", "/project-management"],
  Manager: [
    "/task-assignment",
    "/project-management",
    "/task-manager",
    "/my-task",
    "/attendance",
    "/attendance-log",
    "/organization-management",
  ],
  Supervisor: [
    "/task-assignment",
    "/task-manager",
    "/my-task",
    "/attendance",
    "/attendance-log",
  ],
  Employee: ["/my-task", "/attendance"],
  Unassigned: ["/waiting-approval"],
  "Super Admin": ["*"],
};
