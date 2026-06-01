"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2Icon, AlertCircleIcon, XIcon } from "lucide-react";
import { btnDanger, btnGhost, btnPrimary } from "./ui";

type ToastKind = "success" | "error";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  /** "primary" for confirmations that don't destroy anything. */
  tone?: "danger" | "primary";
}

interface FeedbackApi {
  toast: (message: string, kind?: ToastKind) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export function useFeedback(): FeedbackApi {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return ctx;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { id, kind, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const confirm = useCallback((opts: ConfirmOptions) => {
    setDialog(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setDialog(null);
  };

  const api = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-20 right-4 z-[70] flex flex-col gap-2 lg:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl border border-adm-border bg-adm-surface px-3.5 py-3 text-sm text-adm-text shadow-lg shadow-black/10 animate-fade-in"
          >
            {t.kind === "success" ? (
              <CheckCircle2Icon size={16} className="mt-0.5 shrink-0 text-adm-success" />
            ) : (
              <AlertCircleIcon size={16} className="mt-0.5 shrink-0 text-adm-danger" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="text-adm-subtle transition-colors hover:text-adm-text"
            >
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>

      {dialog && <ConfirmDialog {...dialog} onClose={close} />}
    </FeedbackContext.Provider>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel = "Delete",
  tone = "danger",
  onClose,
}: ConfirmOptions & { onClose: (v: boolean) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-xl border border-adm-border bg-adm-surface p-5 shadow-2xl shadow-black/30"
      >
        <h2 id="confirm-title" className="text-base font-semibold text-adm-text">
          {title}
        </h2>
        {body && <p className="mt-1.5 text-sm text-adm-muted">{body}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button ref={cancelRef} onClick={() => onClose(false)} className={btnGhost}>
            Cancel
          </button>
          <button onClick={() => onClose(true)} className={tone === "danger" ? btnDanger : btnPrimary}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
