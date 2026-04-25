import { seedUsers, type SeedUser } from '@/lib/data/seed-users';

const inMemoryUsers: SeedUser[] = [...seedUsers];

export function findUserByEmail(email: string) {
  return inMemoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: SeedUser) {
  inMemoryUsers.push(user);
  return user;
}
