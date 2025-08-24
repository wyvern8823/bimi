'use client';

import { useState } from 'react';

export function Filters() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [rating, setRating] = useState<number | ''>('');

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-2xl border p-3">
      <div className="flex flex-col text-sm">
        <label className="text-xs text-gray-500">検索</label>
        <input
          className="rounded-lg border px-2 py-1"
          placeholder="店名・タグ"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="flex flex-col text-sm">
        <label className="text-xs text-gray-500">地域</label>
        <input
          className="rounded-lg border px-2 py-1"
          placeholder="Tokyo, Osaka..."
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>
      <div className="flex flex-col text-sm">
        <label className="text-xs text-gray-500">最低評価</label>
        <input
          type="number"
          className="w-24 rounded-lg border px-2 py-1"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : '')}
        />
      </div>
      <button
        onClick={() => {
          const params = new URLSearchParams();
          if (q) params.set('q', q);
          if (region) params.set('region', region);
          if (rating) params.set('minRating', String(rating));
          window.location.href = '/?' + params.toString();
        }}
        className="rounded-lg bg-black px-3 py-2 text-sm text-white"
      >
        絞り込む
      </button>
    </div>
  );
}
