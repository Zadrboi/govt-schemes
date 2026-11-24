export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    // Get unique schemes from project works with counts
    const schemeStats = await prisma.projectWork.groupBy({
      by: ['scheme'],
      _count: { scheme: true },
      _sum: { financialSanction: true, expenditure: true },
    });

    const schemeNames: Record<string, string> = {
      NESIDS_ROADS: 'NESIDS Roads',
      NESIDS_OTRI: 'NESIDS Other Than Roads',
      NEC: 'North Eastern Council',
      PM_DEVINE: 'PM-DevINE',
      SDP: 'State Development Programme',
      MLAADS: 'MLA Area Development Scheme',
      SUHRID: 'Suhrid Scheme',
      UNTIED_FUNDS: 'Untied Funds',
      ASSAM_DARSHAN: 'Assam Darshan',
      AAGY: 'AAGY',
      NATIONAL_JJM_PMGSY_CUSTOM: 'National JJM/PMGSY/Custom',
    };

    const schemes = schemeStats.map(s => ({
      code: s.scheme,
      name: schemeNames[s.scheme] || s.scheme,
      projectCount: s._count.scheme,
      totalOutlayCr: Math.round((s._sum.financialSanction || 0) * 100) / 100,
      totalExpenditureCr: Math.round((s._sum.expenditure || 0) * 100) / 100,
    }));

    return NextResponse.json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve schemes from ledger' },
      { status: 500 }
    );
  }
}