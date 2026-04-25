import { NextResponse } from 'next/server';
import { getControlCenterDashboardPayload } from '@/lib/mock/repositories/control-center.repository';
import { makeMockEnvelope } from '@/lib/mock/envelope';

export async function GET() {
  return NextResponse.json(makeMockEnvelope(getControlCenterDashboardPayload(), {
    requestPrefix: 'ccdash',
    notices: ['Control Center uses simulated repositories. No live tenant admin backend exists yet.']
  }));
}
