export function isMockingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
}

export async function initMocks(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isMockingEnabled()) return;

  const { withBasePath } = await import("@/lib/basePath");
  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: false,
    serviceWorker: {
      url: withBasePath("/mockServiceWorker.js"),
    },
  });
}
