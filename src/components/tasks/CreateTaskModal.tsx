"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Paperclip } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateTaskModalProps {
  userRole: string;
}

const supervisors = [
  { id: "1", name: "Sarah Connor", department: "Engineering" },
  { id: "2", name: "Michael Brown", department: "Operations" },
];

export function CreateTaskModal({ userRole }: CreateTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  // Project State (Mock)
  const [projects, setProjects] = useState([
    { value: "general", label: "General" },
    { value: "marketing", label: "Marketing Campaign" },
    { value: "dev", label: "Development" },
  ]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleQuickAddProject = () => {
    if (!newProjectName) return;
    const id = newProjectName.toLowerCase().replace(/\s/g, "-");
    setProjects([...projects, { value: id, label: newProjectName }]);
    setNewProjectName("");
    setIsAddingProject(false);
  };

  // Logic to determine assignable roles based on hierarchy
  // Executive > Manager > Supervisor > Employee
  let assignLabel = "Assignee";
  if (userRole === "Executive") assignLabel = "Assign to Manager";
  if (userRole === "Manager") assignLabel = "Assign to Supervisor / Employee";
  if (userRole === "Supervisor") assignLabel = "Assign to Employee";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to a team member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Task Title
            </Label>
            <Input id="title" placeholder="Enter task title..." />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Task Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="project"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Project Tag
              </Label>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-blue-600"
                onClick={() => setIsAddingProject(!isAddingProject)}
              >
                + New Project
              </Button>
            </div>

            {isAddingProject ? (
              <div className="flex gap-2">
                <Input
                  placeholder="New project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="h-10"
                />
                <Button size="sm" onClick={handleQuickAddProject} type="button">
                  Add
                </Button>
              </div>
            ) : (
              <Select defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="priority"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Priority
              </Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(userRole === "Manager" || userRole === "Supervisor") && (
              <div className="grid gap-2">
                <Label htmlFor="points" className="text-blue-600 font-semibold">
                  Reward Points
                </Label>
                <Input id="points" type="number" placeholder="e.g. 100" />
                <p className="text-[10px] text-muted-foreground">
                  Points awarded to employee upon completion.
                </p>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="assignee"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              {assignLabel}
            </Label>
            <Input
              id="assignee"
              placeholder={`Search ${assignLabel
                .toLowerCase()
                .replace("assign to ", "")}...`}
              className="mb-2"
            />

            <div className="border rounded-md p-4 space-y-4 bg-muted/20">
              {supervisors.map((s) => (
                <div key={s.id} className="flex items-start space-x-3">
                  <Checkbox id={`supervisor-${s.id}`} />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`supervisor-${s.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {s.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {s.department}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 text-orange-500 text-xs mt-2">
                <span className="border border-orange-500 rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
                Select at least one supervisor
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>dd/mm/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>
              File Attachment{" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer h-24">
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4" />
                <span>Choose file to attach</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
