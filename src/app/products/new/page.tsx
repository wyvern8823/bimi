'use client';

import { BrowserMultiFormatReader } from '@zxing/browser';
import { useEffect, useRef, useState } from 'react';
import { ReviewStepper } from '@/components/review/ReviewStepper';

export default function NewProductReviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [jan, setJan] = useState<string>('');
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result) {
              setJan(result.getText());
            }
          },
        );
        return () => controls.stop();
      } catch (e) {
        // camera permission denied or desktop → allow manual input
      }
    })();
  }, []);

  useEffect(() => {
    if (!jan) return;
    (async () => {
      const res = await fetch(`/api/products/jan/${jan}`);
      const data = await res.json();
      setProduct(data.product);
    })();
  }, [jan]);

  return (
    <main className="mx-auto max-w-screen-sm px-3 pb-16">
      <h1 className="py-3 text-lg font-bold">商品レビューを作成</h1>

      <div className="rounded-2xl border p-3">
        <div className="mb-2 text-sm">JANコードをスキャン</div>
        <video ref={videoRef} autoPlay playsInline className="h-40 w-full rounded-lg bg-black object-cover" />
        <div className="mt-2 text-sm">
          認識: <span className="font-mono">{jan || '-'}</span>
        </div>
        <div className="mt-2">
          <input
            placeholder="手動入力（JAN）"
            className="w-full rounded-lg border px-2 py-1"
            value={jan}
            onChange={(e) => setJan(e.target.value)}
          />
        </div>
      </div>

      {product && (
        <div className="mt-4 rounded-2xl border p-3">
          <div className="text-sm text-gray-600">商品情報</div>
          <div className="text-base font-semibold">{product.name}</div>
          <div className="text-sm text-gray-500">{product.maker} / {product.category}</div>
        </div>
      )}

      <div className="mt-4">
        <ReviewStepper type="PRODUCT" productId={product?.id} />
      </div>
    </main>
  );
}
