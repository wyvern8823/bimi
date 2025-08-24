import { prisma } from '@/lib/db';
import ExportButtons from '@/components/admin/ExportButtons';
import { calcScore, DEFAULT_WEIGHTS } from '@/lib/scoring';

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    include: {
      stats: true,
      _count: { select: { reviews: true } },
    },
  });
  const reviews = await prisma.review.findMany({
    include: { store: true, product: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const campaigns = await prisma.campaign.findMany({
    include: { entries: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-screen-2xl px-3">
      <h1 className="py-4 text-lg font-bold">管理画面</h1>

      <div className="mb-4">
        <ExportButtons />
      </div>

      <section className="mb-6">
        <h2 className="mb-2 font-semibold">ユーザー一覧</h2>
        <div className="overflow-auto rounded-2xl border">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">User</th>
                <th className="p-2">投稿件数</th>
                <th className="p-2">イイネ</th>
                <th className="p-2">企業イイネ</th>
                <th className="p-2">リッチ率</th>
                <th className="p-2">安定度</th>
                <th className="p-2">Trust</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const s = u.stats ?? {
                  reviewCount: u._count.reviews,
                  likeCount: 0,
                  officialLikeCount: 0,
                  richRatio: 0.3,
                  varianceScore: 1,
                  trustLevel: 1,
                };
                const score = calcScore(
                  {
                    reviewCount: s.reviewCount,
                    likeCount: s.likeCount,
                    officialLikeCount: s.officialLikeCount,
                    richRatio: s.richRatio,
                    varianceScore: s.varianceScore,
                  },
                  DEFAULT_WEIGHTS,
                );
                return (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.displayName} @{u.username}</td>
                    <td className="p-2">{s.reviewCount}</td>
                    <td className="p-2">{s.likeCount}</td>
                    <td className="p-2">{s.officialLikeCount}</td>
                    <td className="p-2">{Math.round(s.richRatio * 100)}%</td>
                    <td className="p-2">{(1 - s.varianceScore / 2) .toFixed(2)}</td>
                    <td className="p-2">{score.trustLevel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-semibold">レビュー一覧（最新50）</h2>
        <div className="overflow-auto rounded-2xl border">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">対象</th>
                <th className="p-2">日付</th>
                <th className="p-2">評価</th>
                <th className="p-2">写真</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.type === 'STORE' ? r.store?.name : r.product?.name}</td>
                  <td className="p-2">{r.createdAt.toLocaleString()}</td>
                  <td className="p-2">{r.rating}</td>
                  <td className="p-2">{r.photos.length ? 'あり' : 'なし'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-semibold">モニター案件</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-2xl border p-3">
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="text-xs text-gray-500">
                応募数: {c.entries.filter((e) => e.status === 'APPLIED').length} /
                招待数: {c.entries.filter((e) => e.status === 'INVITED').length} /
                当選: {c.entries.filter((e) => e.status === 'WIN').length}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
