import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function V2ProgressStubPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Progress</h1>
        <p className="text-sm text-slate-400">
          Track-level progress across interview types — planned for v0.3.0.
        </p>
        <Link href="/v2">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
