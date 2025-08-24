'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { SNSShare } from '../common/SNSShare';

const schema = z.object({
  rating: z.coerce.number().min(1).max(5),
  photos: z.array(z.string()).max(10).optional(),
  visitedAt: z.string(),
  comment: z.string().max(2000).optional(),
  tags: z.string().optional(),
  labels: z.string().optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  isPublic: z.coerce.boolean().default(true),
  listId: z.string().optional(),
});

export type StepperProps = {
  defaultValues?: Partial<z.infer<typeof schema>>;
  type: 'STORE' | 'PRODUCT';
  storeId?: string;
  productId?: string;
};

export function ReviewStepper({ defaultValues, type, storeId, productId }: StepperProps) {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 5,
      visitedAt: new Date().toISOString().slice(0, 10),
      isPublic: true,
      ...defaultValues,
    },
  });

  const photos = watch('photos') ?? [];
  const pub = watch('isPublic');

  useEffect(() => {
    // nothing for now
  }, []);

  const preview = useMemo(
    () => ({
      rating: watch('rating'),
      comment: watch('comment'),
      photos: watch('photos'),
      price: watch('price'),
      isPublic: watch('isPublic'),
      tags: watch('tags'),
      labels: watch('labels'),
      visitedAt: watch('visitedAt'),
    }),
    [watch],
  );

  async function onSubmit(values: z.infer<typeof schema>) {
    const payload = {
      ...values,
      photos: values.photos ?? [],
      tags: (values.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      labels: (values.labels ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      type,
      storeId,
      productId,
    };
    const res = await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      alert('投稿に失敗しました');
      return;
    }
    const data = await res.json();
    window.location.href = `/u/me`; // 簡易遷移
  }

  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm">ステップ {step} / 3</div>
        <div className="flex gap-2">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
          >
            戻る
          </button>
          <button
            onClick={() => {
              if (step < 3) setStep((s) => s + 1);
            }}
            className="rounded-lg border px-3 py-1 text-sm"
          >
            次へ
          </button>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">総合評価</label>
            <input
              type="number"
              min={1}
              max={5}
              step={1}
              {...register('rating', { valueAsNumber: true })}
              className="w-24 rounded-lg border px-2 py-1"
            />
            {errors.rating && <span className="text-xs text-red-500">1〜5で入力</span>}
          </div>
          <PhotoUploader
            max={10}
            onUploaded={(urls) => {
              setValue('photos', urls);
            }}
          />
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">来訪/購入日</label>
            <input
              type="date"
              {...register('visitedAt')}
              className="rounded-lg border px-2 py-1"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">コメント（任意）</label>
            <textarea
              {...register('comment')}
              className="min-h-[100px] w-full rounded-lg border p-2 text-sm"
              placeholder="味、雰囲気、サービスなど"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">価格</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="w-32 rounded-lg border px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">タグ</label>
            <input
              {...register('tags')}
              placeholder="ラーメン, 餃子"
              className="flex-1 rounded-lg border px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">ラベル</label>
            <input
              {...register('labels')}
              placeholder="ジャンル/地域/駅/任意ラベル"
              className="flex-1 rounded-lg border px-2 py-1"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-gray-600">公開範囲</label>
            <select
              {...register('isPublic')}
              onChange={(e) => {
                const val = e.target.value === 'true';
                // react-hook-form は string になるので補正
                // @ts-ignore
                e.target.value = String(val);
              }}
              className="rounded-lg border px-2 py-1"
            >
              <option value="true">公開</option>
              <option value="false">非公開</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">マイリスト追加</label>
            <input
              {...register('listId')}
              placeholder="（任意）対象リストID"
              className="w-full rounded-lg border px-2 py-1"
            />
          </div>
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-sm">プレビュー</div>
            <div className="text-sm">⭐ {preview.rating}</div>
            {preview.photos?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {preview.photos.map((u, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={u + i} src={u} alt="" className="h-16 w-16 rounded-md object-cover" />
                ))}
              </div>
            ) : null}
            {preview.comment && <div className="mt-2 whitespace-pre-wrap text-sm">{preview.comment}</div>}
          </div>
          <SNSShare
            url={typeof window !== 'undefined' ? window.location.href : ''}
            text={'グルメ記録を投稿しました'}
          />
          <button
            onClick={handleSubmit(onSubmit)}
            className="mt-3 w-full rounded-lg bg-black py-2 text-white"
          >
            投稿する
          </button>
        </div>
      )}
    </div>
  );
}
