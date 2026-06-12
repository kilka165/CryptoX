"use client";

import { useRef, useState } from "react";
import { Camera, Trash2, User as UserIcon, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "@/lib/axios";
import { AvatarEditorModal } from "./AvatarEditorModal";

interface AvatarSettingsProps {
  avatar: string | null;
  onChange: (avatar: string | null) => void;
}

// Лимит на исходный файл (редактор всё равно ужмёт его до 256px JPEG).
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

export function AvatarSettings({ avatar, onChange }: AvatarSettingsProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editorSrc, setEditorSrc] = useState<string | null>(null);

  // Выбор файла → читаем как data URL и открываем редактор кадрирования.
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // сброс, чтобы можно было выбрать тот же файл повторно
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("settings.avatar.invalidType"));
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError(t("settings.avatar.tooLarge"));
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => setEditorSrc(reader.result as string);
    reader.onerror = () => setError(t("settings.avatar.uploadError"));
    reader.readAsDataURL(file);
  };

  // Готовый квадрат из редактора → загрузка на сервер.
  const handleEditorSubmit = async (dataUrl: string) => {
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/user/avatar", { avatar: dataUrl });
      onChange(res.data.avatar ?? dataUrl);
      setEditorSrc(null);
    } catch (err) {
      console.error(err);
      setError(t("settings.avatar.uploadError"));
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setBusy(true);
    try {
      await api.delete("/user/avatar");
      onChange(null);
    } catch (err) {
      console.error(err);
      setError(t("settings.avatar.uploadError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={36} />
          )}
        </div>
        {busy && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 size={22} className="text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
          >
            <Camera size={16} /> {t("settings.avatar.upload")}
          </button>
          {avatar && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} /> {t("settings.avatar.remove")}
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">{t("settings.avatar.hint")}</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {editorSrc && (
        <AvatarEditorModal
          src={editorSrc}
          busy={busy}
          onCancel={() => setEditorSrc(null)}
          onSubmit={handleEditorSubmit}
        />
      )}
    </div>
  );
}
