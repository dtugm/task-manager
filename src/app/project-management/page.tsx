"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Folder, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock Data
const initialProjects = [
  {
    id: "1",
    name: "General",
    description: "General tasks",
    count: 12,
    status: "Active",
  },
  {
    id: "2",
    name: "Marketing Campaign",
    description: "Social media and ads",
    count: 5,
    status: "Active",
  },
  {
    id: "3",
    name: "Website Revamp",
    description: "Frontend and Backend redesign",
    count: 8,
    status: "In Progress",
  },
];

import { useLanguage } from "@/contexts/language-context";

export default function ProjectManagementPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState(initialProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreate = () => {
    if (!newProject.name) return;
    const project = {
      id: Math.random().toString(),
      name: newProject.name,
      description: newProject.description,
      count: 0,
      status: "Active",
    };
    setProjects([...projects, project]);
    setIsCreating(false);
    setNewProject({ name: "", description: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.projectManagementTitle}
          </h2>
          <p className="text-muted-foreground">{t.projectManagementDesc}</p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? t.cancel : t.newProject}
        </Button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg">{t.createNewProject}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="p-name">{t.projectName}</Label>
              <Input
                id="p-name"
                placeholder={t.projectNamePlaceholder}
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-desc">{t.description}</Label>
              <Textarea
                id="p-desc"
                placeholder={t.projectDescPlaceholder}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>
            <Button onClick={handleCreate} disabled={!newProject.name}>
              {t.saveProject}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.projectName}</TableHead>
                <TableHead>{t.description}</TableHead>
                <TableHead>{t.activeTasks}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Folder className="h-4 w-4" />
                      </div>
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.description}
                  </TableCell>
                  <TableCell>{project.count}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      {project.status === "Active"
                        ? t.active
                        : project.status === "In Progress"
                        ? t.inProgress
                        : project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
