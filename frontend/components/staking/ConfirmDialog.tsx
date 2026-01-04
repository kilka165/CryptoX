// frontend/components/ui/ConfirmDialog.tsx
"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
  result?: {
    message: string;
    details?: string;
  };
}

export function ConfirmDialog({
  isOpen,
  title = "Подтвердите действие",
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  type = "info",
  onConfirm,
  onCancel,
  result,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (result) {
      return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    }
    
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getIconBgColor = () => {
    if (result) {
      return "bg-emerald-500/20";
    }
    
    switch (type) {
      case "warning":
        return "bg-amber-500/20";
      case "success":
        return "bg-emerald-500/20";
      default:
        return "bg-blue-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Заголовок - показываем только если НЕТ результата И есть title */}
        {!result && title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getIconBgColor()} rounded-full flex items-center justify-center`}>
                {getIcon()}
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Если есть результат - показываем иконку и крестик в верху */}
        {result && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className={`w-12 h-12 ${getIconBgColor()} rounded-full flex items-center justify-center`}>
              {getIcon()}
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Содержимое */}
        <div className="p-6">
          {result ? (
            <>
              <p className="text-white text-base mb-2">{result.message}</p>
              {result.details && (
                <p className="text-slate-400 text-sm">{result.details}</p>
              )}
            </>
          ) : (
            <p className="text-slate-300 text-base">{message}</p>
          )}
        </div>

        {/* Кнопки */}
        <div className="p-6 pt-0 flex gap-3">
          {result ? (
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              ОК
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-colors ${
                  type === "warning"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
