"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Helper function to render rich text with links
const renderRichText = (text: string) => {
  if (!text) return "-";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split("\n").map((line, i) => (
    <div key={i} className="min-h-[1.2em]">
      {line.split(urlRegex).map((part, j) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline dark:text-blue-400 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </div>
  ));
};

interface ActivityCellProps {
  text: string;
  title: string;
}

export const ActivityCell = ({ text, title }: ActivityCellProps) => {
  const [open, setOpen] = useState(false);
  const hasContent = text && text.trim().length > 0;

  if (!hasContent) {
    return <span className="text-slate-500">-</span>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="truncate text-slate-600 dark:text-slate-400 cursor-help"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {text}
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[300px] p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-xl"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <p className="font-semibold mb-2 text-slate-900 dark:text-slate-100 text-sm">
            {title}
          </p>
          <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {renderRichText(text)}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
