import { NextResponse } from "next/server";

import { clearCustomerSession } from "@/lib/customer/session";
import { getCustomerAccountConfig } from "@/lib/customer/oauth";

export async function GET(request: Request) {
  await clearCustomerSession();

  const url = new URL(request.url);
  const loginUrl = new URL("/login", url.origin).toString();

  try {
    const config = getCustomerAccountConfig();

    if (config.logoutUrl) {
      const logoutUrl = new URL(config.logoutUrl);
      logoutUrl.searchParams.set("client_id", config.clientId);
      logoutUrl.searchParams.set("post_logout_redirect_uri", loginUrl);
      return NextResponse.redirect(logoutUrl);
    }
  } catch {
    // Fallback to local redirect if configuration is missing
  }

  return NextResponse.redirect(loginUrl);
}

export async function POST(request: Request) {
  return GET(request);
}
