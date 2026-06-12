"use client";

import { ShieldCheck, ShieldAlert, UserIcon, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserCardProps {
  name: string;
  email: string;
  avatar?: string | null;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
}

export function UserCard({ name, email, avatar, emailVerified = false, twoFactorEnabled = false }: UserCardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-[#131416] p-6 rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <UserIcon size={48} />
        )}
      </div>
      <h2 className="text-xl font-bold truncate">{name}</h2>
      <p className="text-sm text-slate-500 truncate">{email}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {emailVerified ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
            <ShieldCheck size={12} /> {t("profile.verified")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
            <ShieldAlert size={12} /> {t("profile.notVerified")}
          </span>
        )}

        {twoFactorEnabled && (
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
            <Smartphone size={12} /> {t("profile.twoFa")}
          </span>
        )}
      </div>
    </div>
  );
}
