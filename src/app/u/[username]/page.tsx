import { prisma } from '@/lib/db';
import { TrustBadge } from '@/components/common/TrustBadge';

export default async function UserPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      stats: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { store: true, product: true },
        take: 20,
      },
    },
  });

  if (!user) {
    return (
      <main className="mx-auto max-w-screen-md px-3">
        <h1 className="py-4 text-lg font-bold">ユーザーが見つかりません</h1>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-screen-md px-3">
      <div className="flex items-center gap-3 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.photoUrl ?? '/avatar.png'} alt="" className="h-12 w-12 rounded-full object-cover" />
        <div>
          <div className="text-lg font-bold">{user.displayName}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
        <div className="ml-auto">
          <TrustBadge level={user.stats?.trustLevel ?? 1} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {user.reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border p-3">
            <div className="text-sm font-semibold">
              {r.type === 'STORE' ? r.store?.name : r.product?.name}
            </div>
            <div className="text-xs text-gray-500">{r.createdAt.toLocaleString()}</div>
            <div className="mt-1 text-sm">⭐ {r.rating}</div>
            {r.comment && <div className="mt-2 text-sm">{r.comment}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}
