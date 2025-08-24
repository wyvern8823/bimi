'use client';

import { useSearchParams } from 'next/navigation';
import { ReviewStepper } from '@/components/review/ReviewStepper';

export default function NewStoreReviewPage() {
  const params = useSearchParams();
  const storeId = params.get('storeId') ?? undefined;

  return (
    <main className="mx-auto max-w-screen-sm px-3 pb-16">
      <h1 className="py-3 text-lg font-bold">店舗レビューを作成</h1>
      <ReviewStepper type="STORE" storeId={storeId} />
    </main>
  );
}
