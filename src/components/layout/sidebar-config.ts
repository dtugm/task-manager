import {
  LayoutDashboard,
  Clock,
  ClipboardList,
  CheckSquare,
  DollarSign,
  Tag,
  Folder,
  Settings,
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
    name: t.taskManagerMgr,
    href: "/task-manager-for-manager",
    icon: ClipboardList,
  },
  {
    name: t.taskManagerSpv,
    href: "/task-manager-for-supervisor",
    icon: CheckSquare,
  },
  { name: t.myTask, href: "/my-task", icon: Tag },
];

export const roleAccess: Record<string, string[]> = {
  Executive: ["/task-assignment", "/project-management"],
  Manager: [
    "/task-assignment",
    "/project-management",
    "/task-manager-for-manager",
    "/my-task",
    "/attendance",
    "/attendance-log",
  ],
  Supervisor: [
    "/task-assignment",
    "/task-manager-for-supervisor",
    "/my-task",
    "/attendance",
    "/attendance-log",
  ],
  Employee: ["/my-task", "/attendance"],
  "Super Admin": ["*"],
};
