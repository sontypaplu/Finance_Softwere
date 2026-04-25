import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/config/environment';
import { ConflictError, AuthError } from '@/lib/api/errors';
import { hashPassword, verifyPassword } from '@/lib/security/password';
import { createWorkspaceForUser } from '@/lib/services/workspace-service';
import { createPortfolio } from '@/lib/services/portfolio-service';
import { ensureRuntimeSeeded } from '@/lib/mock/runtime-store';
import { findUserByEmail, findUserById } from '@/lib/services/user-service';

export async function signupUser(input: { name: string; email: string; password: string }) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new ConflictError('An account with this email already exists.');

  const passwordHash = await hashPassword(input.password);

  if (isDatabaseConfigured()) {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
        role: 'PORTFOLIO_MANAGER'
      }
    });
    const workspace = await createWorkspaceForUser(user.id, `${input.name.split(' ')[0] || 'User'} Workspace`);
    await createPortfolio(workspace.id, { name: 'Portfolio 1', notes: 'Default portfolio created during signup.', baseCurrency: 'USD' });
    return { user, workspace };
  }

  const store = await ensureRuntimeSeeded();
  const user = {
    id: `usr_${nanoid(10)}`,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: 'PORTFOLIO_MANAGER' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerifiedAt: null,
    mfaEnabled: false
  };
  store.users.push(user);
  const workspace = await createWorkspaceForUser(user.id, `${input.name.split(' ')[0] || 'User'} Workspace`);
  await createPortfolio(workspace.id, { name: 'Portfolio 1', notes: 'Default portfolio created during signup.', baseCurrency: 'USD' });
  return { user, workspace };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);
  if (!user) throw new AuthError('Incorrect email or password.');
  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw new AuthError('Incorrect email or password.');
  const workspace = isDatabaseConfigured()
    ? await prisma.workspaceMember.findFirst({ where: { userId: user.id }, include: { workspace: true } }).then((item) => item?.workspace || null)
    : null;
  return { user, workspaceId: workspace?.id };
}

export async function getCurrentUserProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) return null;
  return user;
}
