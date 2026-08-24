"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface V2ResetSessionControlProps {
  onConfirmReset: () => void;
}

export function V2ResetSessionControl({
  onConfirmReset,
}: V2ResetSessionControlProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        Reset session
      </Button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Confirm session reset"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-panel-border bg-slate-950/95 p-3 shadow-xl shadow-black/40 space-y-3"
        >
          <p className="text-sm text-slate-200">
            Start this practice session again?
          </p>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                onConfirmReset();
              }}
            >
              Reset session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
