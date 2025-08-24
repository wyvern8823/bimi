'use client';

export default function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href="/api/admin/export/users.csv"
        className="rounded-lg border px-3 py-1 text-sm"
      >
        ユーザー集計CSV
      </a>
      <a
        href="/api/admin/export/reviews.csv"
        className="rounded-lg border px-3 py-1 text-sm"
      >
        レビュー集計CSV
      </a>
      <a
        href="/api/scoring/recalc"
        className="rounded-lg border px-3 py-1 text-sm"
      >
        スコア再計算
      </a>
    </div>
  );
}
