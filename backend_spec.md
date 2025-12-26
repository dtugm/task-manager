# Backend Specification for Geo AIT Task Manager (NestJS)

## 1. Overview

The backend will be built using **NestJS** with PostgreSQL and **Authentication**. This document outlines the schema, API endpoints, and business logic, specifically focusing on the **Points System**, **Role Hierarchy**, and **Task Propagation**.

## 2. Core Business Logic

### 2.1. Role Hierarchy & Permissions

1. **Executive**:
   - Top level. Assigns tasks to Managers.
   - **No Points System**: Executives do not accumulate points.
   - View: All Data, default : tasks of managers.
2. **Manager**:
   - Reports to Executive. Manages Supervisors/Employees.
   - **Has Points**: Earns points by completing Executive requests.
   - Can create "Related Tasks" (Sub-tasks) for Supervisors.
3. **Supervisor**:
   - Reports to Manager. Manages Employees.
   - **Has Points**: Earns points by completing Manager requests.
4. **Employee**:
   - Reports to Supervisor (or Manager).
   - **Has Points**: Earns points by completing assigned tasks.
   - Logs Attendance, requests Reimbursement.

### 2.2. Points System Logic

- **Definition**: Every Task has a `points` value (integer).
- **Accumulation**: When a task status changes to `ACCEPTED`:
  - If `Assignee.Role !== EXECUTIVE`:
    - `Assignee.Points = Assignee.Points + Task.Points`
  - Executives do not participate in point accumulation.
- **Visibility**:
  - Users can see their own `Total Points` on `/my-task` or Dashboard.
  - Managers/Executives can view subordinates' point summaries for performance review.

## 3. Database Schema (Prisma)

```prisma
// User Model
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String   // Hashed
  fullName    String
  role        Role
  department  String?
  avatarUrl   String?

  // POINTS SUMMARY (Not applicable for Executive)
  points      Int      @default(0)

  tasksCreated      Task[]        @relation("TaskCreator")
  tasksAssigned     Task[]        @relation("TaskAssignee")
  attendanceLogs    Attendance[]
  reimbursements    Reimbursement[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  EXECUTIVE
  MANAGER
  SUPERVISOR
  EMPLOYEE
}

// Task Model
model Task {
  id              String      @id @default(uuid())
  title           String
  description     String

   // RELATION TO PROJECT
  projectId       String
  project         Project     @relation(fields: [projectId], references: [id])

  priority        Priority
  status          Status      @default(PENDING)

  // REWARD
  points          Int         @default(0) // Points awarded upon completion

  dueDate         DateTime
  progress        Int         @default(0) // 0-100%
  attachmentUrl   String?

  // Relationship
  creatorId       String
  creator         User        @relation("TaskCreator", fields: [creatorId], references: [id])
  assigneeId      String
  assignee        User        @relation("TaskAssignee", fields: [assigneeId], references: [id])

  // Self-Relation for "Related Tasks" propagation
  parentTaskId    String?
  parentTask      Task?       @relation("RelatedTasks", fields: [parentTaskId], references: [id])
  childTasks      Task[]      @relation("RelatedTasks")

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
  PENDING_APPROVAL
  ACCEPTED
}

// Attendance
model Attendance {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime @db.Date
  clockIn   DateTime?
  clockOut  DateTime?
  status    AttendanceStatus
  reason    String?  // Mandatory if ABSENT
  location  String?
}

enum AttendanceStatus {
  WFO
  WFH
  FIELD_WORK
  SICK
  ABSENT
}

// Project Model
model Project {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  color       String?  // Hex code for UI tags

  tasks       Task[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 4. API Endpoints Specification

### 4.1. Auth & Profile

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`: Returns User object including `points`.

### 4.2. Users & Stats

- `GET /users`: List users (Filter by Role).
- `GET /users/:id/summary`: Returns enriched stats:
  ```json
  {
    "userId": "uuid",
    "fullName": "Sarah Connor",
    "totalPoints": 1250,
    "tasksCompleted": 15,
    "attendanceRate": "98%"
  }
  ```
  _Logic: If target user is Executive, `totalPoints` can be null or 0._

### 4.3. Projects (`/projects`)

- `GET /projects`: List all active projects.
- `POST /projects`: Create new project.
  - **Body**: `{ name, description, color? }`
- `GET /projects/:id`: Get project details + task stats.

### 4.4. Tasks (`/tasks`)

- `POST /tasks`: Create Task.
  - **Body**: `{ title, ..., points: 100, assigneeId: "..." }`
- `GET /tasks/my-tasks`: Tasks assigned TO the current user.
- `GET /tasks/assigned-by-me`: Tasks created BY the current user.
- `PATCH /tasks/:id/statuschecks`:
  - Function: Update status.
  - Side Effect: If new status is `COMPLETED`, trigger `PointsService.awardPoints(taskId)`.

### 4.4. Attendance

- `POST /attendance/clock-in`
- `POST /attendance/absent`: Requires `reason`.

### 4.5. Dashboard

- `GET /dashboard/stats`:
  - Executive: Total System Points, Overall Task Completion.
  - Manager: Team Points, Team Completion.
  - Employee: **My Total Points**, My Completion.

## 5. Implementation Roadmap

1. **Setup**: NestJS + Postgres.
2. **Auth**: Guards for Roles.
3. **Users**: Implement `points` field logic.
4. **Tasks**: Implement CRUD + "Related Task" recursion + Points awarding logic.
5. **Frontend Integration**: Hook up `/my-task` page to `/tasks/my-tasks` and `/users/me/summary`.
