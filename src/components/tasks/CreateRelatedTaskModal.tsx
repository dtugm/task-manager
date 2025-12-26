"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Plus,
  Tag,
  Search,
  Calendar as CalendarIcon,
  Paperclip,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CreateRelatedTaskModalProps {
  relatedTaskTitle: string;
}

const supervisors = [
  {
    id: "1",
    name: "Sarah Connor",
    department: "Operations",
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "David Lee",
    department: "Engineering",
    isCurrentUser: false,
  },
];

export function CreateRelatedTaskModal({
  relatedTaskTitle,
}: CreateRelatedTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Related Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Create Related Task</DialogTitle>
            {/* Close button is default in DialogContent but properly positioned by shadcn */}
          </div>
          <p className="text-sm text-muted-foreground">
            Related to:{" "}
            <span className="text-foreground font-medium">
              {relatedTaskTitle}
            </span>
          </p>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Main Form Fields */}
          <div className="space-y-4">
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
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="project"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Project Tag
              </Label>
              <Select defaultValue="general">
                <SelectTrigger>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <SelectValue placeholder="Select project" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="dev">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="assignee"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Assign to
              </Label>
              <div className="text-xs text-muted-foreground mb-1">
                You can assign to supervisors or yourself
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search supervisor..." className="pl-9" />
              </div>

              <div className="border rounded-lg p-4 space-y-3 mt-2">
                <div className="flex items-center gap-2 text-orange-500 text-xs font-medium mb-2">
                  <AlertCircleIcon className="h-4 w-4" />
                  Select at least one supervisor
                </div>

                {supervisors.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors"
                  >
                    <Checkbox id={`sup-${s.id}`} className="mt-1" />
                    <div className="grid gap-1">
                      <label
                        htmlFor={`sup-${s.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        {s.name}
                        {s.isCurrentUser && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] h-5 px-1.5"
                          >
                            YOU
                          </Badge>
                        )}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {s.department}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side by Side Fields: Priority & Points */}
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

            <div className="grid gap-2">
              <Label
                htmlFor="points"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Points
              </Label>
              <Input type="number" defaultValue="0" />
            </div>
          </div>

          {/* Due Date */}
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

          {/* File Attachment */}
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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-1/2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => setOpen(false)}
            className="w-full sm:w-1/2 bg-slate-600 hover:bg-slate-700 text-white"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
