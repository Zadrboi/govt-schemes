import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const status = searchParams.get('status');
    const scheme = searchParams.get('scheme');
    const search = searchParams.get('q');

    const where: any = {};
    if (district) where.district = { contains: district };
    if (status) where.status = status;
    if (scheme) where.scheme = scheme;
    if (search) {
      where.OR = [
        { workCode: { contains: search } },
        { title: { contains: search } },
        { contractor: { contains: search } },
        { executingOfficer: { contains: search } },
      ];
    }

    const works = await prisma.projectWork.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        varianceFlags: true,
        inspections: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: works.length,
      data: works,
    });
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve works from ledger' },
      { status: 500 }
    );
  }
}