import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { reviewId, isOfficial = false } = await req.json();
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: 'no user' }, { status: 401 });
  const like = await prisma.like.create({
    data: { reviewId, userId: user.id, isOfficial: !!isOfficial },
  });
  return NextResponse.json({ like });
}
