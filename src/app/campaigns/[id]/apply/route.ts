import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: 'no user' }, { status: 401 });

  const entry = await prisma.campaignEntry.upsert({
    where: { campaignId_userId: { campaignId: params.id, userId: user.id } },
    update: { status: 'APPLIED' },
    create: { campaignId: params.id, userId: user.id, status: 'APPLIED' },
  } as any); // composite unique は本来 schema 側で @@unique(campaignId, userId)

  return NextResponse.json({ entry });
}
