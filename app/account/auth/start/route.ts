import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CUSTOMER_OAUTH_RETURN_TO_COOKIE } from "@/lib/customer/constants";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
  getCustomerAccountConfig,
  oauthCookieNames,
} from "@/lib/customer/oauth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 10, // 10 minutes
};

export async function GET(request: Request) {
  const config = getCustomerAccountConfig();
  const cookieStore = await cookies();

  const state = generateState();
  cookieStore.set(oauthCookieNames.state, state, COOKIE_OPTIONS);

  const authUrl = new URL(config.authorizationUrl);
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("scope", config.scope);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", config.redirectUri);
  authUrl.searchParams.set("state", state);

  if (!config.clientSecret) {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    cookieStore.set(oauthCookieNames.verifier, verifier, COOKIE_OPTIONS);
    authUrl.searchParams.set("code_challenge", challenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
  } else {
    cookieStore.delete(oauthCookieNames.verifier);
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get("return_to");

  if (returnTo && returnTo.startsWith("/")) {
    authUrl.searchParams.set("return_to", returnTo);
    cookieStore.set(CUSTOMER_OAUTH_RETURN_TO_COOKIE, returnTo, COOKIE_OPTIONS);
  } else {
    cookieStore.delete(CUSTOMER_OAUTH_RETURN_TO_COOKIE);
  }

  console.log({ authUrl });

  return NextResponse.redirect(authUrl);
}

export async function POST(request: Request) {
  return GET(request);
}
