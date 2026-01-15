import Link from "next/link";

import { getCustomerAccountConfig } from "@/lib/customer/oauth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    return_to?: string;
  }>;
};

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const LOGIN_REDIRECT_PATH = "/account/callback";

const buildRegisterUrl = (appBaseUrl: string) => {
  if (!SHOP_DOMAIN) {
    return "https://accounts.shopify.com/store-login";
  }

  const returnUrl = new URL(LOGIN_REDIRECT_PATH, appBaseUrl).toString();
  const registerUrl = new URL(`https://${SHOP_DOMAIN}/account/register`);
  registerUrl.searchParams.set("return_url", returnUrl);

  return registerUrl.toString();
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const config = getCustomerAccountConfig();

  const returnTo = (await searchParams)?.return_to;
  const loginUrl =
    returnTo && returnTo.startsWith("/")
      ? `/account/auth/start?return_to=${encodeURIComponent(returnTo)}`
      : "/account/auth/start";
  const registerUrl = buildRegisterUrl(config.appBaseUrl);

  const errorMessage = (await searchParams)?.error;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <main className="mx-auto flex max-w-md flex-col gap-8 px-6 py-16">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Sign in
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            You&apos;ll be redirected to Shopify to verify your email with a
            one-time code.
          </p>
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </p>
        ) : null}

        <a
          href={loginUrl}
          className="inline-flex w-full items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Continue with Shopify
        </a>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?
          <Link href={registerUrl} className="ml-1 underline">
            Create one on Shopify
          </Link>
        </p>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";
