"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const requests = [
  {
    id: 1,
    employee: "John Doe",
    type: "Travel",
    amount: "IDR 500,000",
    date: "2025-12-20",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Sarah Connor",
    type: "Equipment",
    amount: "IDR 2,500,000",
    date: "2025-12-18",
    status: "Approved",
  },
];

export default function ReimbursementManagementPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {t.reimbursementMgmtTitle}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.requests}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.employee}</TableHead>
                <TableHead>{t.expenseType}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.employee}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.amount}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === "Approved"
                          ? "default"
                          : req.status === "Pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {req.status === "Approved"
                        ? t.approved
                        : req.status === "Pending"
                        ? t.pending
                        : t.rejected}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                        >
                          {t.approve}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          {t.reject}
                        </Button>
                      </div>
                    )}
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
