'use client';

import { ShieldCheck } from 'lucide-react';

export function TrustBadge({ level }: { level: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
      <ShieldCheck className="h-3.5 w-3.5" />
      Trust Lv.{level}
    </div>
  );
}
