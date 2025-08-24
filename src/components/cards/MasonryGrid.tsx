'use client';

import Image from 'next/image';

export type CardItem = {
  id: string;
  title: string;
  imageUrl?: string;
  rating?: number;
  link?: string;
};

export default function MasonryGrid({ items }: { items: CardItem[] }) {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      }}
    >
      {items.map((it, idx) => (
        <a
          key={it.id}
          href={it.link ?? '#'}
          className="group block overflow-hidden rounded-2xl border"
        >
          <div className="relative aspect-[4/3] w-full bg-gray-100">
            {it.imageUrl ? (
              <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="line-clamp-2 text-sm font-semibold">{it.title}</div>
            {typeof it.rating === 'number' && (
              <div className="mt-1 text-xs text-gray-500">⭐ {it.rating.toFixed(1)}</div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
