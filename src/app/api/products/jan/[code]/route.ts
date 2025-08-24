import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  const jan = params.code;
  let product = await prisma.product.findUnique({ where: { janCode: jan } });
  if (!product) {
    product = await prisma.product.create({
      data: {
        janCode: jan,
        name: `商品(${jan})`,
        maker: 'Mock Maker',
        category: '食品',
      },
    });
  }
  return NextResponse.json({ product });
}
