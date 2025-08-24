'use client';

import { useUIStore } from '@/store/useUIStore';

export default function WeightsPage() {
  const { weights, setWeights } = useUIStore();
  return (
    <main className="mx-auto max-w-screen-sm px-3">
      <h1 className="py-4 text-lg font-bold">スコア重みの調整</h1>
      <div className="rounded-2xl border p-3">
        {(['count', 'like', 'official', 'rich', 'variance'] as const).map((k) => (
          <div key={k} className="mb-2 flex items-center gap-2">
            <label className="w-24 text-sm text-gray-600">{k}</label>
            <input
              type="number"
              step={0.05}
              className="w-32 rounded-lg border px-2 py-1"
              value={weights[k]}
              onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        ※ このMVPではローカル状態のみ。将来はDBへ保存＆再計算APIへ送信します。
      </div>
    </main>
  );
}
