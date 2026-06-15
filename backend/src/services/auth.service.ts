import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler.js";
import { UserModel } from "../models/user.model.js";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function assertPasswordPolicy(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ApiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  return secret;
}

export function createSessionToken(userId: string, email: string, lastActivityAt: Date) {
  return jwt.sign(
    {
      sub: userId,
      email,
      lastActivityAt: Math.floor(lastActivityAt.getTime() / 1000),
    },
    getJwtSecret(),
    {
      expiresIn: "24h",
    }
  );
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  assertPasswordPolicy(input.password);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const now = new Date();
  const user = await UserModel.create({
    email,
    passwordHash,
    lastActivityAt: now,
  });

  const token = createSessionToken(user.id, user.email, now);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.lastActivityAt = new Date();
  await user.save();

  const token = createSessionToken(user.id, user.email, user.lastActivityAt);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
}

export async function logoutUser(_userId: string): Promise<void> {
  // Stateless JWT logout is handled client-side by discarding the token.
  return Promise.resolve();
}
