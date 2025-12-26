"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "id";

type Translations = {
  dashboard: string;
  attendance: string;
  attendanceLog: string;
  taskAssignment: string;
  reimbursement: string;
  reimbursementMgmt: string;
  projectMgmt: string;
  taskManagerMgr: string;
  taskManagerSpv: string;
  myTask: string;
  search: string;
  language: string;
  theme: string;
  toggleTheme: string;
  logout: string;

  // Dashboard
  welcome: string;
  recentActivity: string;
  totalTasks: string;
  completed: string;
  inProgress: string;
  todo: string;
  totalPoints: string;
  goodJob: string;
  niceWork: string;
  keepItUp: string;
  letsDoIt: string;

  // Attendance
  clockIn: string;
  clockOut: string;
  selectLocation: string;
  selectAttendanceType: string;
  attendanceHistory: string;
  yourPastRecords: string;
  exportLogbook: string;
  weekly: string;
  allWorkType: string;
  noRecords: string;
  office: string;
  wfo: string;
  wfh: string;
  fieldWork: string;
  sick: string;
  absent: string;
  home: string;
  other: string;
  reason: string;
  reasonPlaceholder: string;
  status: string;
  date: string;
  time: string;
  employee: string;
  activities: string;
  location: string;
  refresh: string;
  exportCsv: string;
  pickADate: string;
  filter: string;
  all: string;
  present: string;

  // Tasks
  taskAssignmentTitle: string;
  taskAssignmentDesc: string;
  deleteMode: string;
  pendingApproval: string;
  pending: string;
  accepted: string;
  filterTasks: string;
  filterByStatus: string;
  filterByProject: string;
  filterByPriority: string;
  filterByDate: string;
  searchManager: string;
  searchByName: string;
  showingTasks: string;
  noTasksAssigned: string;
  noTasksCreated: string;
  noTasksReceived: string;
  noTasksAssignedEmployee: string;
  myTasksTitle: string;
  myTasksDesc: string;
  taskManagerTitle: string;
  taskManagerDesc: string;
  tasksFromExecutives: string;
  allEmployeeTasks: string;
  supervisorDashboard: string;
  supervisorDesc: string;
  tasksFromManagers: string;
  employeeTaskAssignment: string;
  filterAssignments: string;
  assignedTasks: string;
  high: string;
  medium: string;
  low: string;
  allStatus: string;
  allProjects: string;
  allPriority: string;

  // Project Management
  projectManagementTitle: string;
  projectManagementDesc: string;
  createNewProject: string;
  projectName: string;
  projectNamePlaceholder: string;
  projectDescPlaceholder: string;
  saveProject: string;
  activeTasks: string;
  active: string;

  // Reimbursement
  reimbursementRequestTitle: string;
  reimbursementRequestDesc: string;
  expenseDetails: string;
  expenseDetailsDesc: string;
  expenseType: string;
  expenseTypePlaceholder: string;
  amount: string;
  amountPlaceholder: string;
  uploadReceipt: string;
  submitRequest: string;
  reimbursementMgmtTitle: string;
  requests: string;
  approved: string;
  approve: string;
  reject: string;
  rejected: string;

  // Common
  newProject: string;
  createTask: string;
  actions: string;
  description: string;
  save: string;
  cancel: string;
};

const translations: Record<Language, Translations> = {
  en: {
    dashboard: "Dashboard",
    attendance: "Attendance",
    attendanceLog: "Attendance Log",
    taskAssignment: "Task Assignment",
    reimbursement: "Reimbursement",
    reimbursementMgmt: "Reimbursement Mgmt",
    projectMgmt: "Project Management",
    taskManagerMgr: "Task Manager (Manager)",
    taskManagerSpv: "Task Manager (Supervisor)",
    myTask: "My Tasks",
    search: "Search...",
    language: "Language",
    theme: "Theme",
    toggleTheme: "Toggle theme",
    logout: "Log out",
    welcome: "Welcome back",
    recentActivity: "Recent Activity",
    totalTasks: "Total Tasks",
    completed: "Completed",
    inProgress: "In Progress",
    todo: "To Do",
    totalPoints: "Total Points",
    goodJob: "Good job!",
    niceWork: "Nice work",
    keepItUp: "Keep it up",
    letsDoIt: "Let's do it",

    // Attendance
    clockIn: "Clock In",
    clockOut: "Clock Out",
    selectLocation: "Select Location",
    selectAttendanceType: "Select Attendance Type",
    attendanceHistory: "Attendance History",
    yourPastRecords: "Your past records",
    exportLogbook: "Export Logbook",
    weekly: "Weekly",
    allWorkType: "All Work Type",
    noRecords: "No records found for this week",
    office: "Office",
    wfo: "Work from Office",
    wfh: "Work from Home",
    fieldWork: "Field Work",
    sick: "Sick",
    absent: "Absent",
    home: "Home",
    other: "Other",
    reason: "Reason",
    reasonPlaceholder: "Enter reason for absence/other location...",
    status: "Status",
    date: "Date",
    time: "Time",
    employee: "Employee",
    activities: "Activities",
    location: "Location",
    refresh: "Refresh",
    exportCsv: "Export CSV",
    pickADate: "Pick a date",
    filter: "Filter",
    all: "All",
    present: "Present",

    // Tasks
    taskAssignmentTitle: "Task Assignment to Managers",
    taskAssignmentDesc: "Create and manage tasks for managers",
    deleteMode: "Delete Mode",
    pendingApproval: "Pending Approval",
    pending: "Pending",
    accepted: "Accepted",
    filterTasks: "Filter Tasks",
    filterByStatus: "Filter by Status",
    filterByProject: "Filter by Project",
    filterByPriority: "Filter by Priority",
    filterByDate: "Filter by Date",
    searchManager: "Search Manager",
    searchByName: "Search by name...",
    showingTasks: "Showing tasks",
    noTasksAssigned: "No tasks assigned yet",
    noTasksCreated: "No tasks created yet",
    noTasksReceived: "No tasks received from managers",
    noTasksAssignedEmployee: "No tasks assigned to employees yet",
    myTasksTitle: "My Tasks",
    myTasksDesc: "Manage and complete your assigned tasks",
    taskManagerTitle: "Task Manager",
    taskManagerDesc: "Manage tasks from executives and assign to employees",
    tasksFromExecutives: "Tasks from Executives",
    allEmployeeTasks: "All Employee Tasks",
    supervisorDashboard: "Supervisor Dashboard",
    supervisorDesc: "Manage tasks from managers and assign to employees",
    tasksFromManagers: "Tasks from Managers",
    employeeTaskAssignment: "Employee Task Assignment",
    filterAssignments: "Filter Assignments",
    assignedTasks: "Assigned Tasks",
    high: "High",
    medium: "Medium",
    low: "Low",
    allStatus: "All Status",
    allProjects: "All Projects",
    allPriority: "All Priority",

    // Project Management
    projectManagementTitle: "Project Management",
    projectManagementDesc: "Create and manage projects for task categorization",
    createNewProject: "Create New Project",
    projectName: "Project Name *",
    projectNamePlaceholder: "e.g. Mobile App V2",
    projectDescPlaceholder: "Brief description of the project...",
    saveProject: "Save Project",
    activeTasks: "Active Tasks",
    active: "Active",

    // Reimbursement
    reimbursementRequestTitle: "Reimbursement Request",
    reimbursementRequestDesc:
      "Submit a new request for expenses reimbursement.",
    expenseDetails: "Expense Details",
    expenseDetailsDesc: "Fill in the details of your expense.",
    expenseType: "Expense Type",
    expenseTypePlaceholder: "e.g. Travel, Meals, Equipment",
    amount: "Amount (IDR)",
    amountPlaceholder: "0",
    uploadReceipt: "Upload Receipt",
    submitRequest: "Submit Request",
    reimbursementMgmtTitle: "Reimbursement Management",
    requests: "Requests",
    approved: "Approved",
    approve: "Approve",
    reject: "Reject",
    rejected: "Rejected",

    newProject: "New Project",
    createTask: "Create Task",
    actions: "Actions",
    description: "Description",
    save: "Save",
    cancel: "Cancel",
  },
  id: {
    dashboard: "Dasbor",
    attendance: "Absensi",
    attendanceLog: "Riwayat Absensi",
    taskAssignment: "Penugasan",
    reimbursement: "Reimbursement",
    reimbursementMgmt: "Manajemen Reimbursement",
    projectMgmt: "Manajemen Proyek",
    taskManagerMgr: "Manajer Tugas (Manajer)",
    taskManagerSpv: "Manajer Tugas (Supervisor)",
    myTask: "Tugas Saya",
    search: "Cari...",
    language: "Bahasa",
    theme: "Tema",
    toggleTheme: "Ganti tema",
    logout: "Keluar",
    welcome: "Selamat datang kembali",
    recentActivity: "Aktivitas Terbaru",
    totalTasks: "Total Tugas",
    completed: "Selesai",
    inProgress: "Sedang Berjalan",
    todo: "Harus Dikerjakan",
    totalPoints: "Total Poin",
    goodJob: "Kerja bagus!",
    niceWork: "Kerja bagus",
    keepItUp: "Pertahankan",
    letsDoIt: "Ayo kerjakan",

    // Attendance
    clockIn: "Masuk",
    clockOut: "Keluar",
    selectLocation: "Pilih Lokasi",
    selectAttendanceType: "Pilih Jenis Absensi",
    attendanceHistory: "Riwayat Absensi",
    yourPastRecords: "Catatan masa lalu Anda",
    exportLogbook: "Ekspor Logbook",
    weekly: "Mingguan",
    allWorkType: "Semua Jenis Kerja",
    noRecords: "Tidak ada catatan untuk minggu ini",
    office: "Kantor",
    wfo: "Kerja dari Kantor (WFO)",
    wfh: "Kerja dari Rumah (WFH)",
    fieldWork: "Kerja Lapangan",
    sick: "Sakit",
    absent: "Absen / Izin",
    home: "Rumah",
    other: "Lainnya",
    reason: "Alasan",
    reasonPlaceholder: "Masukkan alasan...",
    status: "Status",
    date: "Tanggal",
    time: "Waktu",
    employee: "Karyawan",
    activities: "Aktivitas",
    location: "Lokasi",
    refresh: "Segarkan",
    exportCsv: "Ekspor CSV",
    pickADate: "Pilih tanggal",
    filter: "Filter",
    all: "Semua",
    present: "Hadir",

    // Tasks
    taskAssignmentTitle: "Penugasan ke Manajer",
    taskAssignmentDesc: "Buat dan kelola tugas untuk manajer",
    deleteMode: "Mode Hapus",
    pendingApproval: "Menunggu Persetujuan",
    pending: "Menunggu",
    accepted: "Diterima",
    filterTasks: "Filter Tugas",
    filterByStatus: "Filter Status",
    filterByProject: "Filter Proyek",
    filterByPriority: "Filter Prioritas",
    filterByDate: "Filter Tanggal",
    searchManager: "Cari Manajer",
    searchByName: "Cari nama...",
    showingTasks: "Menampilkan tugas",
    noTasksAssigned: "Belum ada tugas yang diberikan",
    noTasksCreated: "Belum ada tugas yang dibuat",
    noTasksReceived: "Belum ada tugas dari manajer",
    noTasksAssignedEmployee: "Belum ada tugas untuk karyawan",
    myTasksTitle: "Tugas Saya",
    myTasksDesc: "Kelola dan selesaikan tugas Anda",
    taskManagerTitle: "Manajer Tugas",
    taskManagerDesc: "Kelola tugas dari eksekutif dan berikan ke karyawan",
    tasksFromExecutives: "Tugas dari Eksekutif",
    allEmployeeTasks: "Semua Tugas Karyawan",
    supervisorDashboard: "Dasbor Supervisor",
    supervisorDesc: "Kelola tugas dari manajer dan berikan ke karyawan",
    tasksFromManagers: "Tugas dari Manajer",
    employeeTaskAssignment: "Penugasan Karyawan",
    filterAssignments: "Filter Penugasan",
    assignedTasks: "Tugas Diberikan",
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
    allStatus: "Semua Status",
    allProjects: "Semua Proyek",
    allPriority: "Semua Prioritas",

    // Project Management
    projectManagementTitle: "Manajemen Proyek",
    projectManagementDesc: "Buat dan kelola proyek untuk kategorisasi tugas",
    createNewProject: "Buat Proyek Baru",
    projectName: "Nama Proyek *",
    projectNamePlaceholder: "mis. Aplikasi Mobile V2",
    projectDescPlaceholder: "Deskripsi singkat proyek...",
    saveProject: "Simpan Proyek",
    activeTasks: "Tugas Aktif",
    active: "Aktif",

    // Reimbursement
    reimbursementRequestTitle: "Permintaan Reimbursement",
    reimbursementRequestDesc: "Ajukan permintaan baru untuk penggantian biaya.",
    expenseDetails: "Detail Pengeluaran",
    expenseDetailsDesc: "Isi detail pengeluaran Anda.",
    expenseType: "Jenis Pengeluaran",
    expenseTypePlaceholder: "mis. Perjalanan, Makan, Peralatan",
    amount: "Jumlah (IDR)",
    amountPlaceholder: "0",
    uploadReceipt: "Unggah Struk",
    submitRequest: "Kirim Permintaan",
    reimbursementMgmtTitle: "Manajemen Reimbursement",
    requests: "Permintaan",
    approved: "Disetujui",
    approve: "Setuju",
    reject: "Tolak",
    rejected: "Ditolak",

    newProject: "Proyek Baru",
    createTask: "Buat Tugas",
    actions: "Aksi",
    description: "Deskripsi",
    save: "Simpan",
    cancel: "Batal",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: translations.en,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
