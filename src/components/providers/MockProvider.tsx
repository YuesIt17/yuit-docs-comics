"use client";

import { useEffect, useState } from "react";
import { isMockingEnabled, useClientMock } from "@/mocks";

export function MockProvider({ children }: { children: React.ReactNode }) {
  const mocking = isMockingEnabled();
  const clientMock = useClientMock();
  const needsMsw = mocking && !clientMock;
  const [ready, setReady] = useState(!needsMsw);

  useEffect(() => {
    if (!needsMsw) return;

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
  }, [needsMsw]);

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
          {clientMock ? "Client mock API" : "MSW mock API"}
        </div>
      )}
      {children}
    </>
  );
}
