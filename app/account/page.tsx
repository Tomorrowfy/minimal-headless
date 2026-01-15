import Link from "next/link";
import { redirect } from "next/navigation";

import { getCustomerInfo } from "@/lib/customer/session";
import { getSubscriptions } from "@/lib/eversubs/storefront/get-subscriptions";
import {
  ACCOUNT_PORTAL_URL,
  CustomerInfo,
  formatDate,
  formatInterval,
  formatPaymentMethod,
  formatPrice,
  formatUnixSeconds,
  resolveSubscriptionTitle,
} from "./lib";

export default async function AccountPage() {
  const info = (await getCustomerInfo()) as CustomerInfo | null;

  if (!info) {
    redirect(`/login?return_to=${encodeURIComponent("/account")}`);
  }

  const emailLabel = info.email ?? "Unknown email";
  const verifiedLabel = info.email_verified ? "Verified" : "Unverified";
  const customerId = info.sub ?? "Unknown";
  const sessionId = info.sid ?? "Unknown";

  const subscriptions = await getSubscriptions();

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
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Subscriptions
                </h2>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {subscriptions.length} subscription
                  {subscriptions.length === 1 ? "" : "s"}
                </p>
              </div>
            </header>

            {subscriptions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
                You don&apos;t have any subscription contracts yet. Manage your
                purchases in the Shopify portal to start a subscription.
              </p>
            ) : (
              <ul className="space-y-4">
                {subscriptions.map((subscription) => {
                  const title = resolveSubscriptionTitle(subscription);

                  const schedule =
                    formatInterval(
                      subscription.billing_policy?.interval,
                      subscription.billing_policy?.interval_count
                    ) ??
                    formatInterval(
                      subscription.delivery_policy?.interval,
                      subscription.delivery_policy?.interval_count
                    );

                  const nextBilling = formatDate(
                    subscription.next_billing_date
                  );

                  const createdAt = formatDate(subscription.created_at);
                  const paymentMethod = formatPaymentMethod(subscription);
                  const deliveryPrice = formatPrice(
                    subscription.delivery_price?.amount,
                    subscription.delivery_price?.currency_code
                  );

                  return (
                    <li
                      key={subscription.id}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/70"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            {title}
                          </h3>
                          {schedule ? (
                            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                              {schedule}
                            </p>
                          ) : null}
                        </div>
                        <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                          {subscription.status ?? "Unknown"}
                        </span>
                      </div>

                      <dl className="mt-4 grid gap-3 text-xs text-neutral-500 dark:text-neutral-400 sm:grid-cols-3">
                        <div>
                          <dt className="uppercase tracking-wide">
                            Next charge
                          </dt>
                          <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                            {nextBilling ?? "Scheduled by Shopify"}
                          </dd>
                        </div>
                        <div>
                          <dt className="uppercase tracking-wide">Created</dt>
                          <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                            {createdAt ?? "—"}
                          </dd>
                        </div>
                        {paymentMethod ? (
                          <div>
                            <dt className="uppercase tracking-wide">
                              Payment method
                            </dt>
                            <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                              {paymentMethod}
                            </dd>
                          </div>
                        ) : null}
                        {deliveryPrice ? (
                          <div>
                            <dt className="uppercase tracking-wide">
                              Delivery fee
                            </dt>
                            <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                              {deliveryPrice}
                            </dd>
                          </div>
                        ) : null}
                      </dl>

                      {subscription.lines?.length ? (
                        <ul className="mt-4 space-y-2">
                          {subscription.lines.map((line) => {
                            if (!line) return null;

                            const lineTitle = line.title ?? "Subscription item";
                            const variant = line.variant_title;
                            const qty = line.quantity ?? 1;
                            const price =
                              formatPrice(
                                line.current_price?.amount,
                                line.current_price?.currency_code ??
                                  subscription.delivery_price?.currency_code
                              ) ?? undefined;

                            return (
                              <li
                                key={
                                  line.id ??
                                  `${lineTitle}-${variant ?? "variant"}`
                                }
                                className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-200"
                              >
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                                    {lineTitle}
                                  </p>
                                  {variant ? (
                                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                      {variant}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="text-right text-xs text-neutral-500 dark:text-neutral-400">
                                  <p>Qty {qty}</p>
                                  {price ? (
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                      {price}
                                    </p>
                                  ) : null}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={ACCOUNT_PORTAL_URL}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Manage account on Shopify
          </Link>
          <Link
            href="/logout"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
          >
            Sign out
          </Link>
        </div>
      </main>
    </div>
  );
}
