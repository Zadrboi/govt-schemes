export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/security/auth';

const feedbackSchema = z.object({
  queryLang: z.enum(['en', 'as', 'hi', 'bn']).default('en'),
  userPrompt: z.string().max(1000),
  assistantResponse: z.string().max(4000),
  citedSourcesJson: z.string().optional(),
  rating: z.enum(['HELPFUL', 'INCORRECT', 'OUTDATED']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid feedback data' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const record = await prisma.aiFeedback.create({
      data: {
        userId: user?.id || null,
        queryLang: parsed.data.queryLang,
        userPrompt: parsed.data.userPrompt,
        assistantResponse: parsed.data.assistantResponse,
        citedSourcesJson: parsed.data.citedSourcesJson || null,
        rating: parsed.data.rating,
      },
    });

    return NextResponse.json({
      success: true,
      feedbackId: record.id,
      message: 'Citizen feedback successfully recorded in official governance queue.',
    });
  } catch (error) {
    console.error('AI Feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error recording feedback' },
      { status: 500 }
    );
  }
}
