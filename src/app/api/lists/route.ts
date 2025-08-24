import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // MVP: 現在ユーザーの最初のリストだけ返す
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ items: [] });
  const lists = await prisma.list.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { review: { include: { store: true, product: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  return NextResponse.json({ items: lists });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: 'no user' }, { status: 401 });

  const premium = user.isPremium;
  const limit = premium
    ? Number(process.env.PREMIUM_LIST_LIMIT_PREMIUM ?? 9999)
    : Number(process.env.PREMIUM_LIST_LIMIT_FREE ?? 20);

  const count = await prisma.list.count({ where: { userId: user.id } });
  if (!premium && count >= limit) {
    return NextResponse.json({ error: 'list limit reached' }, { status: 403 });
  }

  const created = await prisma.list.create({
    data: {
      userId: user.id,
      name: body.name,
      description: body.description,
      meta: body.meta ?? {},
      isPublic: !!body.isPublic,
    },
  });
  return NextResponse.json({ list: created });
}
