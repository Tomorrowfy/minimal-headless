import crypto from "crypto";
import {
  CUSTOMER_OAUTH_STATE_COOKIE,
  CUSTOMER_OAUTH_VERIFIER_COOKIE,
} from "./constants";

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
const HEADLESS_ID =
  process.env.NEXT_PUBLIC_HEADLESS_ID ??
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;

const DEFAULT_SCOPE =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_SCOPE ??
  "openid email customer-account-api:full";
const CUSTOMER_ACCOUNT_API_VERSION =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION ??
  process.env.SHOPIFY_API_VERSION ??
  "2025-01";

const FALLBACK_AUTH_URL = SHOP_DOMAIN
  ? `https://${SHOP_DOMAIN}/account/oauth/authorize`
  : undefined;

const FALLBACK_TOKEN_URL = SHOP_DOMAIN
  ? `https://${SHOP_DOMAIN}/account/oauth/token`
  : undefined;

const FALLBACK_LOGOUT_URL = SHOP_DOMAIN
  ? `https://${SHOP_DOMAIN}/account/logout`
  : undefined;

const FALLBACK_CUSTOMER_API_URL =
  SHOP_DOMAIN && CUSTOMER_ACCOUNT_API_VERSION
    ? `https://${SHOP_DOMAIN}/account/customer/api/${CUSTOMER_ACCOUNT_API_VERSION}/graphql`
    : undefined;

export const getCustomerAccountConfig = () => {
  const authorizationUrl =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL ?? FALLBACK_AUTH_URL;
  const tokenUrl =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL ?? FALLBACK_TOKEN_URL;
  const logoutUrl =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL ?? FALLBACK_LOGOUT_URL;
  const apiUrl =
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_GRAPHQL_URL ??
    FALLBACK_CUSTOMER_API_URL;

  if (!authorizationUrl || !tokenUrl || !apiUrl) {
    throw new Error(
      "Missing Customer Account API endpoints. Set SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL, SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL, and SHOPIFY_CUSTOMER_ACCOUNT_GRAPHQL_URL (or provide SHOPIFY_STORE_DOMAIN and SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION)."
    );
  }

  if (!HEADLESS_ID) {
    throw new Error(
      "Missing Customer Account API client ID. Set NEXT_PUBLIC_HEADLESS_ID or SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID in your environment."
    );
  }

  if (!APP_BASE_URL || !APP_BASE_URL.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL must be defined and use https to support Customer Account login flows."
    );
  }

  const redirectUri = new URL("/account/callback", APP_BASE_URL).toString();

  return {
    authorizationUrl,
    tokenUrl,
    logoutUrl,
    apiUrl,
    clientId: HEADLESS_ID,
    clientSecret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET,
    scope: DEFAULT_SCOPE,
    redirectUri,
    appBaseUrl: APP_BASE_URL,
  } as const;
};

export const generateState = () => crypto.randomUUID();

const toBase64Url = (input: Buffer) =>
  input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

export const generateCodeVerifier = () => toBase64Url(crypto.randomBytes(64));

export const generateCodeChallenge = async (verifier: string) => {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return toBase64Url(hash);
};

export const oauthCookieNames = {
  state: CUSTOMER_OAUTH_STATE_COOKIE,
  verifier: CUSTOMER_OAUTH_VERIFIER_COOKIE,
};
