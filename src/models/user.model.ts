import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.ts';

type UserWhereInput = {
  id?: string;
  email?: string;
  tier?: string;
  isActive?: boolean;
};

export type RegisterUserInput = {
  email: string;
  password: string;
  tier?: string;
  tokenLimit?: number;
  isActive?: boolean;
};

const publicUserSelect = {
  id: true,
  email: true,
  tier: true,
  tokensUsed: true,
  tokenLimit: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function find(where: UserWhereInput = {}) {
  return prisma.user.findMany({
    where,
    select: publicUserSelect,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

export async function findOne(where: UserWhereInput) {
  return prisma.user.findFirst({
    where,
    select: publicUserSelect,
  });
}

export async function register(data: RegisterUserInput) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      passwordHash,
      tier: data.tier ?? 'free',
      tokenLimit: data.tokenLimit,
      isActive: data.isActive ?? true,
    },
    select: publicUserSelect,
  });
}
