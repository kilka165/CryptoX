"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Формирует список страниц с многоточиями. Длина всегда постоянная (7 слотов),
// чтобы при листании ряд не сдвигался и стрелки оставались на месте.
function getRange(current: number, total: number): (number | "...")[] {
  const totalSlots = 7; // 1 … N N N … last

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const showLeftDots = current > 4;
  const showRightDots = current < total - 3;

  // Около начала: 1 2 3 4 5 … last
  if (!showLeftDots && showRightDots) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  // Около конца: 1 … last-4 … last
  if (showLeftDots && !showRightDots) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  // В середине: 1 … cur-1 cur cur+1 … last
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="prev"
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="h-9 w-9 flex items-center justify-center text-slate-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-blue-600 text-white"
                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="next"
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
