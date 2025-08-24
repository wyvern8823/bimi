'use client';

import dynamic from 'next/dynamic';
import MasonryGrid from '@/components/cards/MasonryGrid';
import { useEffect, useState } from 'react';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function ListsPage() {
  const [tab, setTab] = useState<'map' | 'cards'>('map');
  const [items, setItems] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/lists');
      const data = await res.json();
      const list = data.items?.[0]; // MVP: 1つだけ表示
      const reviews = list?.items?.map((it: any) => it.review) ?? [];
      setItems(
        reviews.map((r: any) => ({
          id: r.id,
          title: r.store?.name ?? r.product?.name ?? 'Untitled',
          imageUrl: r.photos?.[0],
          rating: r.rating,
          link: `/u/me#${r.id}`,
        })),
      );
      setMarkers(
        reviews
          .filter((r: any) => r.store?.lat && r.store?.lng)
          .map((r: any) => ({
            id: r.id,
            lat: r.store.lat,
            lng: r.store.lng,
            title: r.store.name,
            rating: r.rating,
          })),
      );
    })();
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl px-2 sm:px-4">
      <div className="flex gap-2 py-3">
        <button
          className={`rounded-lg border px-3 py-1 text-sm ${tab === 'map' ? 'bg-black text-white' : ''}`}
          onClick={() => setTab('map')}
        >
          Map
        </button>
        <button
          className={`rounded-lg border px-3 py-1 text-sm ${tab === 'cards' ? 'bg-black text-white' : ''}`}
          onClick={() => setTab('cards')}
        >
          Cards
        </button>
      </div>
      {tab === 'map' ? (
        <div className="h-[60vh] rounded-2xl border">
          <MapView markers={markers} />
        </div>
      ) : (
        <div className="py-2">
          <MasonryGrid items={items} />
        </div>
      )}
    </main>
  );
}
