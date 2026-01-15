import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import {
  CUSTOMER_ACCESS_TOKEN_COOKIE,
  CUSTOMER_ID_TOKEN_COOKIE,
  CUSTOMER_OAUTH_RETURN_TO_COOKIE,
  CUSTOMER_OAUTH_STATE_COOKIE,
  CUSTOMER_OAUTH_VERIFIER_COOKIE,
  CUSTOMER_REFRESH_TOKEN_COOKIE,
  EVERSUBS_STOREFRONT_TOKEN_COOKIE,
} from "./constants";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const buildCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  ...(typeof maxAge === "number"
    ? { maxAge: Math.max(0, Math.floor(maxAge)) || undefined }
    : {}),
});

type SetCustomerSessionOptions = {
  accessToken: string;
  expiresInSeconds?: number;
  expiresAt?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresInSeconds?: number;
};

export const setCustomerSession = async ({
  accessToken,
  expiresInSeconds,
  expiresAt,
  refreshToken,
  refreshTokenExpiresInSeconds,
}: SetCustomerSessionOptions) => {
  const cookieStore = await cookies();

  const accessTokenMaxAge =
    typeof expiresInSeconds === "number"
      ? expiresInSeconds
      : expiresAt
      ? Math.max(
          0,
          Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
        )
      : DEFAULT_MAX_AGE;

  cookieStore.set(
    CUSTOMER_ACCESS_TOKEN_COOKIE,
    accessToken,
    buildCookieOptions(accessTokenMaxAge)
  );

  if (refreshToken) {
    const refreshMaxAge =
      typeof refreshTokenExpiresInSeconds === "number"
        ? refreshTokenExpiresInSeconds
        : DEFAULT_MAX_AGE;

    cookieStore.set(
      CUSTOMER_REFRESH_TOKEN_COOKIE,
      refreshToken,
      buildCookieOptions(refreshMaxAge)
    );
  }
};

export const clearCustomerSession = async () => {
  const cookieStore = await cookies();
  [
    CUSTOMER_ACCESS_TOKEN_COOKIE,
    CUSTOMER_REFRESH_TOKEN_COOKIE,
    CUSTOMER_ID_TOKEN_COOKIE,
    CUSTOMER_OAUTH_STATE_COOKIE,
    CUSTOMER_OAUTH_VERIFIER_COOKIE,
    CUSTOMER_OAUTH_RETURN_TO_COOKIE,
  ].forEach((name) => cookieStore.delete(name));
};

export const getCustomerAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value ?? null;
};

export const getCustomerRefreshToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_REFRESH_TOKEN_COOKIE)?.value ?? null;
};

export const setCustomerIdToken = async (idToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_ID_TOKEN_COOKIE, idToken, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const getCustomerInfo = async () => {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get(CUSTOMER_ID_TOKEN_COOKIE)?.value ?? null;

  if (!storedToken) {
    return null;
  }

  return decodeCustomerIDToken(storedToken);
};

export const decodeCustomerIDToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return decoded && typeof decoded === "object" ? decoded : null;
  } catch {
    return null;
  }
};

export const setEversubsStorefrontToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(EVERSUBS_STOREFRONT_TOKEN_COOKIE, token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1, // 1 hr
  });
};

export const getEversubsStorefrontToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(EVERSUBS_STOREFRONT_TOKEN_COOKIE)?.value ?? null;
};
