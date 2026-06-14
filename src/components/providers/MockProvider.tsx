"use client";

import { useEffect, useState } from "react";
import { isMockingEnabled } from "@/mocks";

export function MockProvider({ children }: { children: React.ReactNode }) {
  const mocking = isMockingEnabled();
  const [ready, setReady] = useState(!mocking);

  useEffect(() => {
    if (!mocking) return;

    let mounted = true;

    import("@/mocks")
      .then(({ initMocks }) => initMocks())
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err) => {
        console.error("[MSW] Failed to start mock worker:", err);
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [mocking]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-400 text-sm">
        Starting mock API...
      </div>
    );
  }

  return (
    <>
      {mocking && (
        <div className="fixed bottom-14 right-4 z-50 px-2 py-1 rounded-md bg-amber-950/90 border border-amber-700 text-[10px] text-amber-200 font-mono">
          MSW mock API
        </div>
      )}
      {children}
    </>
  );
}
