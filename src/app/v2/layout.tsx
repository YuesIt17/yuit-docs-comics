import { V2Navigation } from "@/components/v2/V2Navigation";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <V2Navigation />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
}
