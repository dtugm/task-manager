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
  ClipboardClock,
  Route,
  FolderKanban,
  Users,
  Calendar,
  ClipboardCheck,
  ClockFading,
  ClockCheck,
} from "lucide-react";

export type SidebarGroup = {
  title?: string;
  items: {
    name: string;
    href: string;
    icon: any;
  }[];
};

export const getNavigation = (t: any): SidebarGroup[] => [
  {
    items: [
      { name: t.dashboard, href: "/", icon: LayoutDashboard },
      { name: t.pathAccess, href: "/path-access", icon: Route },
    ],
  },
  {
    title: t.attendance, // Using t.attendance as title might be "Attendance", check if suitable or needs new key. Usually safe.
    items: [
      { name: t.attendance, href: "/attendance", icon: Clock },
      { name: t.attendanceLog, href: "/attendance-log", icon: ClipboardClock },
      {
        name: t.pauseovertime,
        href: "/pause-and-overtime",
        icon: ClockFading,
      },
      {
        name: t.overtimeapproval,
        href: "/overtime-approval",
        icon: ClockCheck,
      },
      {
        name: t.leaveApprovals,
        href: "/leave-approvals",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Finance", // Hardcoding for now if 't' doesn't have a generic Finance key, or reuse t.reimbursement if suitable? user didn't ask for i18n for group titles specifically but let's see. t.reimbursement is "Reimbursement". Maybe t.finance exists? I will use string literal "Finance" for now and user can adjust or I can grep localization files later if needed. Actually, I should probably check if there is a 'Finance' key or just use "Finance". The prompt didn't specify i18n for new headers.
    items: [
      { name: t.reimbursement, href: "/reimbursement", icon: DollarSign },
      {
        name: t.reimbursementMgmt,
        href: "/reimbursement-management",
        icon: Settings,
      },
    ],
  },
  {
    title: "Project & Tasks",
    items: [
      {
        name: t.projectMgmt,
        href: "/project-management",
        icon: Folder,
      },
      { name: t.taskAssignment, href: "/task-assignment", icon: CheckSquare },
      {
        name: t.taskManagerMgr,
        href: "/task-manager",
        icon: FolderKanban,
      },
      { name: t.myTask, href: "/my-task", icon: Tag },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        name: t.organizationMgmt,
        href: "/organization-management",
        icon: Building2,
      },
      {
        name: t.userStats,
        href: "/user-stats",
        icon: Users,
      },
    ],
  },
];
