'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Filters } from '@/components/common/Filters';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

type ReviewMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  rating: number;
};

export default function HomePage() {
  const [markers, setMarkers] = useState<ReviewMarker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/reviews?type=STORE&isPublic=1&limit=100');
      const data = await res.json();
      const ms: ReviewMarker[] = data.items.map((r: any) => ({
        id: r.id,
        lat: r.store?.lat ?? 35.681236,
        lng: r.store?.lng ?? 139.767125,
        title: r.store?.name ?? 'Store',
        rating: r.rating,
      }));
      setMarkers(ms);
    };
    fetchData();
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl px-2 sm:px-4">
      <Filters />
      <div className="mt-3 h-[60vh] rounded-2xl border">
        <MapView markers={markers} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {markers.slice(0, 9).map((m) => (
          <div key={m.id} className="rounded-2xl border p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <div className="font-semibold">{m.title}</div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="text-sm">{m.rating.toFixed(1)}</span>
            </div>
            <div className="mt-3">
              <Link href={`/reviews/new?storeId=${m.id}`} className="text-sm underline">
                この店をレビューする
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}