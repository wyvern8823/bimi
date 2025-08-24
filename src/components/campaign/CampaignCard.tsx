'use client';

export default function CampaignCard({ campaign }: { campaign: any }) {
  async function apply() {
    const res = await fetch(`/api/campaigns/${campaign.id}/apply`, { method: 'POST' });
    if (res.ok) {
      alert('応募しました');
    } else {
      alert('応募に失敗しました');
    }
  }

  return (
    <div className="rounded-2xl border p-3">
      <div className="text-base font-semibold">{campaign.title}</div>
      <div className="text-sm text-gray-500">{campaign.description}</div>
      <div className="mt-2 text-xs text-gray-500">
        {campaign.mode} / cap {campaign.capacity} / {new Date(campaign.startsAt).toLocaleDateString()} - {new Date(campaign.endsAt).toLocaleDateString()}
      </div>
      {campaign.mode === 'APPLY' ? (
        <button onClick={apply} className="mt-2 rounded-lg border px-3 py-1 text-sm">
          応募する
        </button>
      ) : (
        <div className="mt-2 text-xs text-gray-500">招待制（管理者より招待）</div>
      )}
    </div>
  );
}
