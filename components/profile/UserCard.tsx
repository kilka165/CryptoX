"use client";

import { ShieldCheck, UserIcon } from "lucide-react";

interface UserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
        <UserIcon size={40} />
      </div>
      <h2 className="text-xl font-bold truncate">{name}</h2>
      <p className="text-sm text-slate-500 truncate">{email}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
        <ShieldCheck size={12} /> Верифицирован
      </div>
    </div>
  );
}
