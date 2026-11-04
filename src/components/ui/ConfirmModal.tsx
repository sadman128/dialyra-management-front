"use client";

import React, { useEffect } from "react";
import { Trash2, AlertTriangle, HelpCircle, RotateCw, PhoneCall, History, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  icon?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    const handleBlur = () => {
      if (isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("blur", handleBlur);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const renderIcon = () => {
    if (icon === "delete" || variant === "danger") return <Trash2 size={22} />;
    if (icon === "history" || icon === "phone_in_talk") return <RotateCw size={22} />;
    if (variant === "warning") return <AlertTriangle size={22} />;
    return <HelpCircle size={22} />;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBox: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30",
          button: "bg-rose-600 hover:bg-rose-700 text-white active:scale-95",
        };
      case "warning":
        return {
          iconBox: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
          button: "bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold active:scale-95",
        };
      default:
        return {
          iconBox: "bg-purple-500/15 text-[#9a55ff] border border-purple-500/30",
          button: "btn-gradient-primary text-white active:scale-95",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBox}`}
          >
            {renderIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="confirm-modal-title"
              className="text-base sm:text-lg font-bold text-on-surface leading-tight"
            >
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed font-medium">
              {description}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors -mr-1 -mt-1 cursor-pointer"
            aria-label="Close dialog"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-sm hover:shadow cursor-pointer ${styles.button}`}
            type="button"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
