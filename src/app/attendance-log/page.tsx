"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  RotateCcw,
  Download,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { useLanguage } from "@/contexts/language-context";

export default function AttendanceLogPage() {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t.attendanceLog}</h2>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col xl:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  className="pl-9 bg-muted/30 border-none shadow-sm"
                />
              </div>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[260px] justify-start text-left font-normal bg-muted/30 border-none shadow-sm",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{t.pickADate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Filter Dropdown */}
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] bg-muted/30 border-none shadow-sm">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="present">{t.present}</SelectItem>
                  <SelectItem value="absent">{t.absent}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:text-blue-700 shadow-sm border-none"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t.refresh}
              </Button>
              <Button
                variant="outline"
                className="text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100 hover:text-purple-700 shadow-sm border-none"
              >
                <Download className="mr-2 h-4 w-4" />
                {t.exportCsv}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border-t pt-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.employee}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.date}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.clockIn}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.clockOut}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.allWorkType}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.status}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.reason}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.activities}
                  </TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-muted-foreground">
                    {t.location}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Empty State */}
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>{t.noRecords}</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
