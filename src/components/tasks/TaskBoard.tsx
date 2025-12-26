"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tasks = [
  {
    id: 1,
    title: "Q3 Marketing Strategy",
    status: "In Progress",
    assignee: "Sarah Connor (Manager)",
    priority: "High",
  },
  {
    id: 2,
    title: "Server Migration",
    status: "Pending",
    assignee: "Michael Brown (Supervisor)",
    priority: "Critical",
  },
  {
    id: 3,
    title: "Update Documentation",
    status: "Completed",
    assignee: "John Doe (Employee)",
    priority: "Low",
  },
];

export function TaskBoard({ userRole }: { userRole: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            <Badge
              variant={task.status === "Completed" ? "secondary" : "default"}
            >
              {task.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-2">
              Assigned to: {task.assignee}
            </div>
            <div className="mt-4 text-xs font-semibold">
              Priority: {task.priority}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
