'use client';

import { useForm } from 'react-hook-form';

type Form = {
  title: string;
  description?: string;
  capacity: number;
  mode: 'APPLY' | 'INVITE';
  isPublic: boolean;
  startsAt: string;
  endsAt: string;
};

export default function CampaignForm() {
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      capacity: 10,
      mode: 'APPLY',
      isPublic: true,
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    },
  });

  async function onSubmit(v: Form) {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('作成に失敗しました');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600">タイトル</label>
        <input className="w-full rounded-lg border px-2 py-1" {...register('title', { required: true })} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600">説明</label>
        <textarea className="w-full rounded-lg border p-2" {...register('description')} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">募集人数</label>
        <input type="number" className="w-full rounded-lg border px-2 py-1" {...register('capacity', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">モード</label>
        <select className="w-full rounded-lg border px-2 py-1" {...register('mode')}>
          <option value="APPLY">応募制</option>
          <option value="INVITE">招待制</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600">開始日</label>
        <input type="date" className="w-full rounded-lg border px-2 py-1" {...register('startsAt')} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">終了日</label>
        <input type="date" className="w-full rounded-lg border px-2 py-1" {...register('endsAt')} />
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <input type="checkbox" {...register('isPublic')} />
        <span className="text-sm">公開する</span>
      </div>
      <button type="submit" className="md:col-span-2 rounded-lg bg-black py-2 text-white">
        募集カードを作成
      </button>
    </form>
  );
}
