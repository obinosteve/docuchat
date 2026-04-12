import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../lib/tokens.ts';

export type RegisterInput = {
  email: string;
  password: string;
  tier?: string;
  tokenLimit?: number;
  isActive?: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
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

function createHttpError(message: string, status: number) {
  const error = new Error(message);
  (error as Error & { status?: number }).status = status;
  return error;
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function getRefreshTokenExpiryDate() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
}

async function persistRefreshToken(user: { id: string; tier: string }) {
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    },
  });

  return refreshToken;
}

export async function register(data: RegisterInput) {
  const email = normalizeEmail(data.email);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw createHttpError('User with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      tier: data.tier ?? 'free',
      tokenLimit: data.tokenLimit,
      isActive: data.isActive ?? true,
    },
    select: publicUserSelect,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await persistRefreshToken(user);

  return {
    message: 'User registered successfully',
    user,
    accessToken,
    refreshToken,
  };
}

export async function login(data: LoginInput) {
  const email = normalizeEmail(data.email);

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      tier: true,
      tokensUsed: true,
      tokenLimit: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw createHttpError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw createHttpError('User account is inactive', 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError('Invalid email or password', 401);
  }

  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  const accessToken = generateAccessToken(safeUser);
  const refreshToken = await persistRefreshToken(safeUser);

  return {
    message: 'Login successful',
    user: safeUser,
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  let payload;

  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw createHttpError('Invalid refresh token', 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });

  if (!storedToken) {
    throw createHttpError('Refresh token not found', 401);
  }

  if (storedToken.expiresAt <= new Date()) {
    await prisma.refreshToken.delete({
      where: { token },
    });
    throw createHttpError('Refresh token has expired', 401);
  }

  if (storedToken.userId !== payload.sub) {
    throw createHttpError('Refresh token is invalid', 401);
  }

  if (!storedToken.user.isActive) {
    throw createHttpError('User account is inactive', 403);
  }

  const newAccessToken = generateAccessToken(storedToken.user);
  const newRefreshToken = generateRefreshToken(storedToken.user);

  await prisma.refreshToken.update({
    where: { token },
    data: {
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    },
  });

  return {
    message: 'Token refreshed successfully',
    user: storedToken.user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
