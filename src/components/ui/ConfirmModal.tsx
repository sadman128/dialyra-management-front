"use client";

import React, { useEffect } from "react";
import { Icon } from "./Icon";

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const defaultIcon =
    icon || (variant === "danger" ? "delete" : variant === "warning" ? "warning" : "help");

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBox: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30",
          button:
            "bg-error text-on-error hover:bg-error/90 active:scale-95",
        };
      case "warning":
        return {
          iconBox: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
          button:
            "bg-amber-600 text-white hover:bg-amber-700 active:scale-95",
        };
      default:
        return {
          iconBox: "bg-primary-container/15 text-primary-container border border-primary-container/30",
          button:
            "bg-primary-container text-on-primary hover:bg-primary active:scale-95",
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
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBox}`}
          >
            <Icon name={defaultIcon} size={24} />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="confirm-modal-title"
              className="text-base sm:text-lg font-bold text-on-surface leading-tight"
            >
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-semibold shadow-xs text-xs sm:text-sm transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              onConfirm();
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all ${styles.button}`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
