/**
 * Poorvottar Drishti — Authenticated AI Tool Calling (OWASP LLMSVS v2.0 Compliant)
 * Strictly scopes all personal data lookups to the authenticated session.user.id.
 * NEVER allows the LLM or user to pass arbitrary user IDs or query other accounts.
 */

import prisma from '@/lib/db/prisma';

export interface UserPersonalStatusSummary {
  grievances: Array<{
    ticketCode: string;
    category: string;
    status: string;
    district: string;
    escalationLevel: number;
    createdAt: string;
  }>;
  drafts: Array<{
    formType: string;
    step: number;
    updatedAt: string;
  }>;
}

/**
 * Allowlisted server-side helper strictly hard-scoped to session.user.id.
 */
export async function getAuthenticatedUserRecords(
  sessionUserId: string
): Promise<UserPersonalStatusSummary> {
  if (!sessionUserId || typeof sessionUserId !== 'string' || !sessionUserId.trim()) {
    throw new Error('UNAUTHORIZED_TOOL_INVOCATION: Invalid session ID');
  }

  // 1. Fetch only grievances owned by this authenticated user
  const grievances = await prisma.grievance.findMany({
    where: { userId: sessionUserId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      ticketCode: true,
      category: true,
      status: true,
      district: true,
      escalationLevel: true,
      createdAt: true,
    },
  });

  // 2. Fetch only form drafts owned by this authenticated user
  const drafts = await prisma.formDraft.findMany({
    where: { userId: sessionUserId },
    select: {
      formType: true,
      step: true,
      updatedAt: true,
    },
  });

  return {
    grievances: grievances.map((g) => ({
      ticketCode: g.ticketCode,
      category: g.category,
      status: g.status,
      district: g.district,
      escalationLevel: g.escalationLevel,
      createdAt: g.createdAt.toISOString().split('T')[0],
    })),
    drafts: drafts.map((d) => ({
      formType: d.formType,
      step: d.step,
      updatedAt: d.updatedAt.toISOString().split('T')[0],
    })),
  };
}
