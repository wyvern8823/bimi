import { prisma } from '@/lib/db';
import CampaignForm from '@/components/campaign/CampaignForm';
import CampaignCard from '@/components/campaign/CampaignCard';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-screen-lg px-3">
      <h1 className="py-4 text-lg font-bold">モニター募集</h1>
      <div className="mb-6">
        <CampaignForm />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    </main>
  );
}
