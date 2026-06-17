import { basePath, withBasePath } from "@/lib/basePath";

export function isMockingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
}

/** MSW service workers hang on GitHub Pages subpaths — use in-process mock instead. */
export function useClientMock(): boolean {
  return isMockingEnabled() && Boolean(basePath);
}

export async function initMocks(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isMockingEnabled() || useClientMock()) return;

  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: false,
    serviceWorker: {
      url: withBasePath("/mockServiceWorker.js"),
    },
  });
}
