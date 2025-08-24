import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { userId } = await req.json();
  const entry = await prisma.campaignEntry.create({
    data: { campaignId: params.id, userId, status: 'INVITED' },
  });
  return NextResponse.json({ entry });
}
