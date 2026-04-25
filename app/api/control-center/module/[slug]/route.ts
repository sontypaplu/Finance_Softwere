import { NextResponse } from 'next/server';
import { getControlCenterModulePayload } from '@/lib/mock/repositories/control-center.repository';
import { makeMockEnvelope } from '@/lib/mock/envelope';
import type { ControlCenterModuleId } from '@/lib/contracts/control-center';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  return NextResponse.json(makeMockEnvelope(getControlCenterModulePayload(slug as ControlCenterModuleId), {
    requestPrefix: 'ccmod',
    notices: ['Module actions are UI-only. Audit, approvals, and support flows are simulated until services are connected.']
  }));
}
