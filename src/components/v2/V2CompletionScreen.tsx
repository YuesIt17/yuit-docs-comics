"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface V2CompletionScreenProps {
  title: string;
  summary: string;
  onReplay: () => void;
}

export function V2CompletionScreen({
  title,
  summary,
  onReplay,
}: V2CompletionScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 leading-relaxed">{summary}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={onReplay}>Practice Again</Button>
          <Link href="/v2">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
