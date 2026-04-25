import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';

export async function listReportsForWorkspace(workspaceId: string) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.report.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
    } catch {
      // fallback
    }
  }
  return [];
}

export async function generateReportFoundation(input: { workspaceId: string; portfolioId: string; type: string; format: string; generatedById: string }) {
  if (isDatabaseConfigured()) {
    try {
      return await prisma.report.create({
        data: {
          workspaceId: input.workspaceId,
          portfolioId: input.portfolioId,
          type: input.type,
          format: input.format,
          status: 'QUEUED',
          generatedById: input.generatedById
        }
      });
    } catch {
      // fallback
    }
  }

  return {
    status: 'queued' as const,
    message: 'Report generation foundation created. Real PDF/CSV/Excel generation will attach in a later phase.',
    request: input
  };
}
