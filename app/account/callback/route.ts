import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CUSTOMER_OAUTH_RETURN_TO_COOKIE } from "@/lib/customer/constants";
import {
  getCustomerAccountConfig,
  oauthCookieNames,
} from "@/lib/customer/oauth";
import {
  clearCustomerSession,
  decodeCustomerIDToken,
  setCustomerIdToken,
  setCustomerSession,
  setEversubsStorefrontTokenCookie,
} from "@/lib/customer/session";
import { fetchStorefrontToken } from "@/lib/eversubs/merchant/fetch-storefront-token";

const DEFAULT_REDIRECT_PATH = "/";
const ERROR_MESSAGE =
  "We couldn’t sign you in. Please request a new login link.";

const REQUEST_TIMEOUT = 15_000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const returnTo = url.searchParams.get("return_to");

  const cookieStore = await cookies();
  const storedState = cookieStore.get(oauthCookieNames.state)?.value;
  const storedVerifier = cookieStore.get(oauthCookieNames.verifier)?.value;
  const storedReturnTo = cookieStore.get(
    CUSTOMER_OAUTH_RETURN_TO_COOKIE
  )?.value;

  cookieStore.delete(oauthCookieNames.state);
  cookieStore.delete(oauthCookieNames.verifier);
  cookieStore.delete(CUSTOMER_OAUTH_RETURN_TO_COOKIE);

  if (error) {
    console.log("RETURNED WITH ERROR");
    console.log({ error });
    return redirectWithError(url, decodeURIComponent(error));
  }

  if (!code || !state || !storedState || state !== storedState) {
    console.log("RETURNED WITH NO CODE OR STATE");
    return redirectWithError(url, ERROR_MESSAGE);
  }

  try {
    const config = getCustomerAccountConfig();

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      code,
      redirect_uri: config.redirectUri,
    });

    console.log({
      secret: config.clientSecret,
      verifier: storedVerifier,
    });

    if (config.clientSecret) {
      params.set("client_secret", config.clientSecret);
    } else if (storedVerifier) {
      params.set("code_verifier", storedVerifier);
    } else {
      return redirectWithError(url, ERROR_MESSAGE);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    console.log({ config });

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await safeJson(response);
      console.log({ body });
      const message =
        body?.error_description ||
        body?.error ||
        `Token exchange failed (${response.status})`;
      return redirectWithError(url, message);
    }

    const tokenPayload = await response.json();

    const accessToken: string | undefined = tokenPayload.access_token;
    const refreshToken: string | undefined = tokenPayload.refresh_token;
    const expiresIn: number | undefined = tokenPayload.expires_in;
    const refreshExpiresIn: number | undefined =
      tokenPayload.refresh_token_expires_in;
    const idToken: string | undefined = tokenPayload.id_token;

    console.log({ tokenPayload });

    if (!accessToken) {
      return redirectWithError(url, ERROR_MESSAGE);
    }

    if (idToken) {
      await setCustomerIdToken(idToken);

      const decoded = decodeCustomerIDToken(idToken);

      console.log({ decoded });

      if (decoded?.sub) {
        try {
          const eversubsStorefrontToken = await fetchStorefrontToken(
            process.env.NEXT_PUBLIC_STORE_NAME!,
            `gid://shopify/Customer/${decoded.sub}`
          );

          console.log({ eversubsStorefrontToken });

          await setEversubsStorefrontTokenCookie(eversubsStorefrontToken.token);
        } catch (e) {
          console.error(e);
        }
      }
    }

    console.log({
      session: {
        accessToken,
        expiresInSeconds: expiresIn,
        refreshToken,
        refreshTokenExpiresInSeconds: refreshExpiresIn,
      },
    });

    await setCustomerSession({
      accessToken,
      expiresInSeconds: expiresIn,
      refreshToken,
      refreshTokenExpiresInSeconds: refreshExpiresIn,
    });

    console.log({ returnTo, storedReturnTo });

    const resolvedReturnTo =
      returnTo && returnTo.startsWith("/")
        ? returnTo
        : storedReturnTo && storedReturnTo.startsWith("/")
          ? storedReturnTo
          : undefined;

    const safeRedirect = resolvedReturnTo ?? DEFAULT_REDIRECT_PATH;

    return NextResponse.redirect(
      new URL(safeRedirect, process.env.NEXT_PUBLIC_APP_URL)
    );
  } catch (err) {
    await clearCustomerSession();
    const message =
      err instanceof Error
        ? err.message
        : "Unexpected error during authentication.";
    return redirectWithError(url, message);
  }
}

const redirectWithError = (url: URL, message: string) => {
  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
};

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};
