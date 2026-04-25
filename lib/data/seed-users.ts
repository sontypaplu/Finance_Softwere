export type SeedUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export const seedUsers: SeedUser[] = [
  {
    id: 'usr_demo_1',
    name: 'Aurelius Demo',
    email: 'demo@aurelius.finance',
    password: 'Demo@1234',
    role: 'Owner'
  }
];
