import { useState } from "react";
import { DateRange } from "react-day-picker";

export const useAttendanceLogFilters = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [recordType, setRecordType] = useState("all");
  const [workType, setWorkType] = useState("all");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [projectId, setProjectId] = useState("all");

  const clearFilters = () => {
    setSearch("");
    setDate({ from: undefined, to: undefined });
    setRecordType("all");
    setWorkType("all");
    setStatus("all");
    setRole("all");
    setProjectId("all");
  };

  return {
    // Filter values
    search,
    date,
    recordType,
    workType,
    status,
    role,
    projectId,
    // Setters
    setSearch,
    setDate,
    setRecordType,
    setWorkType,
    setStatus,
    setRole,
    setProjectId,
    // Actions
    clearFilters,
  };
};
