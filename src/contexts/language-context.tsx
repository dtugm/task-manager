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
  pathAccess: string;
  leaveApprovals: string;

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
  project: string;
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
  delete: string;
  confirmDeletion: string;
  confirmDeletionDesc: string;
  deleteTask: string;
  deleting: string;
  noTasksFound: string;
  itemsPerPage: string;
  page: string;
  of: string;
  first: string;
  previous: string;
  next: string;
  last: string;

  // New keys for Manager/Supervisor pages
  allTasks: string;
  progressFromEmployees: string;
  relatedTasks: string;
  relatedTasksForEmployees: string;
  assignedTo: string;
  unassigned: string;
  from: string;
  unknown: string;
  noTasksFromExecutivesEmpty: string;

  // Approval Workflow
  approveTask: string;
  rejectTask: string;
  askApproval: string;
  processing: string;
  confirm: string;

  // Filter keys
  fromDate: string;
  toDate: string;
  priority: string;
  searchPlaceholder: string;

  // Forms & Modals
  title: string;
  enterTaskTitle: string;
  enterTaskDesc: string;
  points: string;
  dueDate: string;
  assignTo: string;
  assignToEmployees: string;
  typeToSearchSupervisors: string;
  typeToSearchEmployees: string;
  selectProject: string;
  creating: string;
  createRelatedTask: string;
  relatedTo: string;

  // Task Detail
  assignedBy: string;
  updateProgress: string;
  slideToSetProgress: string;
  saveProgress: string;
  activityLogs: string;
  noLogs: string;
  addComment: string;
  writeComment: string;
  sendComment: string;
  sending: string;
  progressUpdated: string;
  commentAdded: string;
  totalAssigned: string;
  progress: string;

  // Project Members
  backToProject: string;
  addMember: string;
  editRole: string;
  removeMember: string;
  searchUserHelp: string;
  typeToSearchUsers: string;
  noMembersFound: string;
  tryAdjustingFilters: string;
  role: string;
  user: string;
  member: string;
  removeMemberConfirmTitle: string;
  removeMemberConfirmDesc: string;
  rowsPerPage: string;
  organizationMgmt: string;
  createOrganization: string;
  createOrgDesc: string;
  manageUsers: string;
  organizationName: string;
  deleteOrganization: string;
  confirmDeleteOrg: string;
  confirmDeleteOrgDesc: string;
  addUser: string;
  addUserToOrg: string;
  changeRole: string;
  setActive: string;
  isActive: string;
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
    taskManagerMgr: "Task Manager ",
    taskManagerSpv: "Task Manager (Supervisor)",
    myTask: "My Tasks",
    pathAccess: "Path Access",
    leaveApprovals: "Leave Approvals",
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
    project: "Project",

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
    delete: "Delete",
    confirmDeletion: "Confirm Deletion",
    confirmDeletionDesc:
      "Are you sure you want to delete this task? This action cannot be undone.",
    deleteTask: "Delete Task",
    deleting: "Deleting...",
    noTasksFound: "No tasks found. Create your first task to get started!",
    itemsPerPage: "Items per page:",
    page: "Page",
    of: "of",
    first: "First",
    previous: "Previous",
    next: "Next",
    last: "Last",

    // New keys for Manager/Supervisor pages
    allTasks: "All Tasks",
    progressFromEmployees: "Progress from Employees",
    relatedTasks: "Related Task(s)",
    relatedTasksForEmployees: "Related Tasks for Employees",
    assignedTo: "Assigned to",
    unassigned: "Unassigned",
    from: "From",
    unknown: "Unknown",
    noTasksFromExecutivesEmpty: "No tasks from executives yet.",

    // Approval Workflow
    approveTask: "Approve Task",
    rejectTask: "Reject Task",
    askApproval: "Ask Approval",
    processing: "Processing...",
    confirm: "Confirm",

    // Filter keys
    fromDate: "From Date",
    toDate: "To Date",
    priority: "Priority",
    searchPlaceholder: "Search tasks...",

    // Forms & Modals
    title: "Title",
    enterTaskTitle: "Enter task title",
    enterTaskDesc: "Enter task description",
    points: "Points",
    dueDate: "Due Date",
    assignTo: "Assign to ",
    assignToEmployees: "Assign to Employees",
    typeToSearchSupervisors: "Type to search supervisors...",
    typeToSearchEmployees: "Type to search employees...",
    selectProject: "Select project",
    creating: "Creating...",
    createRelatedTask: "Create Related Task",
    relatedTo: "Related to:",

    // Task Detail
    assignedBy: "Assigned By",
    updateProgress: "Update Progress",
    slideToSetProgress: "Slide to set progress",
    saveProgress: "Save Progress",
    activityLogs: "Activity Logs & Comments",
    noLogs: "No logs or comments yet.",
    addComment: "Add Comment",
    writeComment: "Write your update or comment...",
    sendComment: "Send Comment",
    sending: "Sending...",
    progressUpdated: "Progress updated successfully",
    commentAdded: "Comment added successfully",
    totalAssigned: "Total Assigned",
    progress: "Progress",

    // Project Members
    backToProject: "Back to Project",
    addMember: "Add Member",
    editRole: "Edit Role",
    removeMember: "Remove Member",
    searchUserHelp: "Search for users to add to the team.",
    typeToSearchUsers: "Type to search users...",
    noMembersFound: "No members found",
    tryAdjustingFilters: "Try adjusting your filters or add a new member.",
    role: "Role",
    user: "User",
    member: "Member",
    removeMemberConfirmTitle: "Remove Member",
    removeMemberConfirmDesc:
      "Are you sure you want to remove this member from the project?",
    rowsPerPage: "Rows per page:",
    organizationMgmt: "Organization Management",
    createOrganization: "Create Organization",
    createOrgDesc: "Create a new organization and manage its members.",
    manageUsers: "Manage Users",
    organizationName: "Organization Name",
    deleteOrganization: "Delete Organization",
    confirmDeleteOrg: "Delete Organization?",
    confirmDeleteOrgDesc:
      "This action is permanent. All data related to this organization will be lost.",
    addUser: "Add User",
    addUserToOrg: "Add User to Organization",
    changeRole: "Change Role",
    setActive: "Set Active",
    isActive: "Active",
  },
  id: {
    dashboard: "Dasbor",
    attendance: "Absensi",
    attendanceLog: "Riwayat Absensi",
    taskAssignment: "Penugasan",
    reimbursement: "Reimbursement",
    reimbursementMgmt: "Manajemen Reimbursement",
    projectMgmt: "Manajemen Proyek",
    taskManagerMgr: "Manajer Tugas",
    taskManagerSpv: "Manajer Tugas (Supervisor)",
    myTask: "Tugas Saya",
    pathAccess: "Akses Halaman",
    leaveApprovals: "Perizinan",
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
    project: "Proyek",

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
    delete: "Hapus",
    confirmDeletion: "Konfirmasi Penghapusan",
    confirmDeletionDesc:
      "Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.",
    deleteTask: "Hapus Tugas",
    deleting: "Menghapus...",
    noTasksFound:
      "Tugas tidak ditemukan. Buat tugas pertama Anda untuk memulai!",
    itemsPerPage: "Item per halaman:",
    page: "Halaman",
    of: "dari",
    first: "Pertama",
    previous: "Sebelumnya",
    next: "Selanjutnya",
    last: "Terakhir",

    // New keys for Manager/Supervisor pages
    allTasks: "Semua Tugas",
    progressFromEmployees: "Progres dari Karyawan",
    relatedTasks: "Tugas Terkait",
    relatedTasksForEmployees: "Tugas Terkait untuk Karyawan",
    assignedTo: "Ditugaskan ke",
    unassigned: "Belum Ditugaskan",
    from: "Dari",
    unknown: "Tidak Diketahui",
    noTasksFromExecutivesEmpty: "Belum ada tugas dari eksekutif.",

    // Approval Workflow
    approveTask: "Setujui Tugas",
    rejectTask: "Tolak Tugas",
    askApproval: "Minta Persetujuan",
    processing: "Memproses...",
    confirm: "Konfirmasi",

    // Filter keys
    fromDate: "Dari Tanggal",
    toDate: "Sampai Tanggal",
    priority: "Prioritas",
    searchPlaceholder: "Cari tugas...",

    // Forms & Modals
    title: "Judul",
    enterTaskTitle: "Masukkan judul tugas",
    enterTaskDesc: "Masukkan deskripsi tugas",
    points: "Poin",
    dueDate: "Tenggat Waktu",
    assignTo: "Tugaskan ke",
    assignToEmployees: "Tugaskan ke Karyawan",
    typeToSearchSupervisors: "Ketik untuk mencari supervisor...",
    typeToSearchEmployees: "Ketik untuk mencari karyawan...",
    selectProject: "Pilih proyek",
    creating: "Sedang membuat...",
    createRelatedTask: "Buat Tugas Terkait",
    relatedTo: "Terkait dengan:",

    // Task Detail
    assignedBy: "Ditugaskan Oleh",
    updateProgress: "Perbarui Progres",
    slideToSetProgress: "Geser untuk mengatur progres",
    saveProgress: "Simpan Progres",
    activityLogs: "Riwayat Aktivitas & Komentar",
    noLogs: "Belum ada riwayat atau komentar.",
    addComment: "Tambah Komentar",
    writeComment: "Tulis pembaruan atau komentar Anda...",
    sendComment: "Kirim Komentar",
    sending: "Mengirim...",
    progressUpdated: "Progres berhasil diperbarui",
    commentAdded: "Komentar berhasil ditambahkan",
    totalAssigned: "Total Ditugaskan",
    progress: "Progres",

    // Project Members
    backToProject: "Kembali ke Proyek",
    addMember: "Tambah Anggota",
    editRole: "Edit Peran",
    removeMember: "Hapus Anggota",
    searchUserHelp: "Cari pengguna untuk ditambahkan",
    typeToSearchUsers: "Ketik untuk mencari pengguna...",
    noMembersFound: "Tidak ada anggota ditemukan",
    tryAdjustingFilters: "Coba sesuaikan filter atau tambahkan anggota baru.",
    role: "Peran",
    user: "Pengguna",
    member: "Anggota",
    removeMemberConfirmTitle: "Hapus Anggota",
    removeMemberConfirmDesc:
      "Apakah Anda yakin ingin menghapus anggota ini dari proyek?",
    rowsPerPage: "Baris per halaman:",
    organizationMgmt: "Manajemen Organisasi",
    createOrganization: "Buat Organisasi",
    createOrgDesc: "Buat organisasi baru dan kelola anggotanya.",
    manageUsers: "Kelola Pengguna",
    organizationName: "Nama Organisasi",
    deleteOrganization: "Hapus Organisasi",
    confirmDeleteOrg: "Hapus Organisasi?",
    confirmDeleteOrgDesc:
      "Penghapusan ini permanen. Semua data terkait organisasi ini akan hilang.",
    addUser: "Tambah Pengguna",
    addUserToOrg: "Tambah Pengguna ke Organisasi",
    changeRole: "Ubah Peran",
    setActive: "Set Aktif",
    isActive: "Aktif",
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
