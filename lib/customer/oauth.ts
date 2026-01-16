import crypto from "crypto";
import {
  CUSTOMER_OAUTH_STATE_COOKIE,
  CUSTOMER_OAUTH_VERIFIER_COOKIE,
} from "./constants";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
const HEADLESS_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const CUSTOMER_ACCOUNT_SCOPE = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SCOPE;

export const getCustomerAccountConfig = () => {
  const authorizationUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL;
  const tokenUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL;
  const logoutUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL;
  const apiUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_GRAPHQL_URL;

  if (!authorizationUrl || !tokenUrl || !apiUrl) {
    throw new Error(
      "Missing Customer Account API endpoints. Set SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL, SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL, and SHOPIFY_CUSTOMER_ACCOUNT_GRAPHQL_URL."
    );
  }

  if (!HEADLESS_ID) {
    throw new Error(
      "Missing Customer Account API client ID. Set SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID in your environment."
    );
  }

  if (!APP_BASE_URL || !APP_BASE_URL.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL must be defined and use https to support Customer Account login flows."
    );
  }

  if (!CUSTOMER_ACCOUNT_SCOPE) {
    throw new Error(
      "Missing Customer Account API scope. Set SHOPIFY_CUSTOMER_ACCOUNT_SCOPE in your environment."
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
    scope: CUSTOMER_ACCOUNT_SCOPE,
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
