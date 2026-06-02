// frontend/components/p2p/SearchableSelect.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  allLabel: string;
  searchPlaceholder: string;
  emptyText: string;
}

export function SearchableSelect({
  value,
  options,
  onChange,
  allLabel,
  searchPlaceholder,
  emptyText,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label ?? value
    : allLabel;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          o.value.toLowerCase().includes(q)
      )
    : options;

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
      >
        <span className={`truncate ${value ? "" : "text-slate-500"}`}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white dark:bg-[#1a1b1e] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
          <div className="relative p-2 border-b border-slate-200 dark:border-slate-700">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {!q && (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-slate-500">{allLabel}</span>
                  {!value && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              </li>
            )}
            {filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="truncate">{o.label}</span>
                  {value === o.value && (
                    <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">{emptyText}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
