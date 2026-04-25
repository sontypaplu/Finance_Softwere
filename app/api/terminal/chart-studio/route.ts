import { NextResponse } from 'next/server';
import { chartStudioSeed } from '@/lib/data/chart-studio-seed';
export async function GET() { return NextResponse.json(chartStudioSeed); }
