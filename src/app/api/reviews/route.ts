import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as 'STORE' | 'PRODUCT' | null;
  const userId = searchParams.get('userId');
  const isPublic = searchParams.get('isPublic');
  const region = searchParams.get('region');
  const limit = Number(searchParams.get('limit') ?? '50');

  const items = await prisma.review.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(userId ? { userId } : {}),
      ...(isPublic ? { isPublic: Boolean(Number(isPublic)) } : {}),
      ...(region ? { store: { region } } : {}),
    },
    include: { store: true, product: true },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 200),
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    type,
    storeId,
    productId,
    rating,
    comment,
    photos = [],
    visitedAt,
    price,
    tags = [],
    labels = [],
    isPublic = true,
  } = body;

  // MVP: 認証を簡略化 (本来はセッションから userId)
  const user = await prisma.user.findFirst();
  const userId = user?.id ?? (await prisma.user.create({
    data: {
      username: 'demo',
      displayName: 'Demo User',
      isPremium: true,
    },
  })).id;

  const created = await prisma.review.create({
    data: {
      type,
      storeId,
      productId,
      rating,
      comment,
      photos,
      visitedAt: new Date(visitedAt),
      price,
      tags,
      labels,
      isPublic,
      userId,
    },
  });

  // 簡易にユーザースタッツを更新（本来は集計ロジックで）
  const counts = await prisma.review.count({ where: { userId } });
  await prisma.userStats.upsert({
    where: { userId },
    create: { userId, reviewCount: counts },
    update: { reviewCount: counts },
  });

  return NextResponse.json({ review: created });
}
