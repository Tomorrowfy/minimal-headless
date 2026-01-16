import { redirect } from "next/navigation";

import { getCustomerInfo } from "@/lib/customer/session";
import { getSubscriptions } from "@/lib/eversubs/storefront/get-subscriptions";
import { Suspense } from "react";
import { CustomerInfo, formatUnixSeconds } from "./lib";
import { Subscriptions, SubscriptionSkeleton } from "./Subscriptions";

export default async function AccountPage() {
  const info = (await getCustomerInfo()) as CustomerInfo | null;

  if (!info) {
    redirect(`/login?return_to=${encodeURIComponent("/account")}`);
  }

  const emailLabel = info.email ?? "Unknown email";
  const verifiedLabel = info.email_verified ? "Verified" : "Unverified";
  const customerId = info.sub ?? "Unknown";
  const sessionId = info.sid ?? "Unknown";

  const subscriptions = getSubscriptions();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Account overview
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            You&apos;re signed in with your Shopify customer account. Update
            your details or view order history from the Shopify portal.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Contact
            </h2>
            <dl className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Email
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {emailLabel}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Verification status
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {verifiedLabel}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Identifiers
            </h2>
            <dl className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Shopify customer ID
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {customerId}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Session ID
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {sessionId}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Tokens
            </h2>
            <dl className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Issued
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {formatUnixSeconds(info.iat)}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Expires
                </dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {formatUnixSeconds(info.exp)}
                </dd>
              </div>
              {info.aud ? (
                <div>
                  <dt className="text-neutral-500 dark:text-neutral-400">
                    Client ID
                  </dt>
                  <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                    {info.aud}
                  </dd>
                </div>
              ) : null}
            </dl>
          </article>
        </section>

        <section className="grid gap-6">
          <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Subscriptions
              </h2>
            </header>

            <Suspense
              fallback={
                <ul className="space-y-4">
                  <SubscriptionSkeleton />
                  <SubscriptionSkeleton />
                  <SubscriptionSkeleton />
                </ul>
              }
            >
              <Subscriptions subscriptionsPromise={subscriptions} />
            </Suspense>

            {/* {subscriptions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
                You don&apos;t have any subscription contracts yet. Manage your
                purchases in the Shopify portal to start a subscription.
              </p>
            ) : (
              
            )} */}
          </article>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href="/logout"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
          >
            Sign out
          </a>
        </div>
      </main>
    </div>
  );
}
