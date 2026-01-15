import { SubscriptionsPromise } from "@/lib/eversubs/storefront/get-subscriptions";
import { use, type FC, type HTMLAttributes } from "react";
import {
  formatDate,
  formatInterval,
  formatPaymentMethod,
  formatPrice,
  resolveSubscriptionTitle,
} from "./lib";
import { StatusSwtich } from "./StatusSwtich";

type SubscriptionsProps = {
  subscriptionsPromise: SubscriptionsPromise;
} & HTMLAttributes<HTMLDivElement>;

export const Subscriptions: FC<SubscriptionsProps> = (props) => {
  const subscriptions = use(props.subscriptionsPromise);

  return (
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

        const nextBilling = formatDate(subscription.next_billing_date);

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

              <StatusSwtich
                subscriptionId={subscription.id}
                status={subscription.status ?? "Unknown"}
              />
            </div>

            <dl className="mt-4 grid gap-3 text-xs text-neutral-500 dark:text-neutral-400 sm:grid-cols-3">
              <div>
                <dt className="uppercase tracking-wide">Next charge</dt>
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
                  <dt className="uppercase tracking-wide">Payment method</dt>
                  <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                    {paymentMethod}
                  </dd>
                </div>
              ) : null}
              {deliveryPrice ? (
                <div>
                  <dt className="uppercase tracking-wide">Delivery fee</dt>
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
                      key={line.id ?? `${lineTitle}-${variant ?? "variant"}`}
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
  );
};

export const SubscriptionSkeleton = () => {
  return (
    <li className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/70">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-base font-semibold bg-neutral-300 animate-pulse rounded-lg text-transparent">
            The Complete Snowboard
          </h3>
          <p className="text-xs uppercase tracking-wide bg-neutral-300 animate-pulse rounded-lg text-transparent">
            EVERY 3 WEEKS
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-xs  sm:grid-cols-3">
        <div>
          <dt className="uppercase tracking-wide">Next charge</dt>
          <dd className="font-medium bg-neutral-300 animate-pulse rounded-lg text-transparent">
            Feb 5, 2026
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Created</dt>
          <dd className="font-medium bg-neutral-300 animate-pulse rounded-lg text-transparent">
            Jan 15, 2026
          </dd>
        </div>

        <div>
          <dt className="uppercase tracking-wide">Payment method</dt>
          <dd className="font-medium bg-neutral-300 animate-pulse rounded-lg text-transparent">
            Credit Card •••• •••• •••• 1
          </dd>
        </div>

        <div>
          <dt className="uppercase tracking-wide">Delivery fee</dt>
          <dd className="font-medium bg-neutral-300 animate-pulse rounded-lg text-transparent">
            $0.00
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-2">
        <li className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-200">
          <div className="min-w-0">
            <p className="truncate font-medium bg-neutral-300 animate-pulse rounded-lg text-transparent">
              The Complete Snowboard
            </p>

            <p className="truncate text-xs bg-neutral-300 animate-pulse rounded-lg text-transparent">
              Snow
            </p>
          </div>
          <div className="text-right text-xs bg-neutral-300 animate-pulse rounded-lg text-transparent">
            <p>Qty 1</p>

            <p className="font-semibold bg-neutral-300 animate-pulse rounded-lg text-transparent">
              $00,00
            </p>
          </div>
        </li>
      </ul>
    </li>
  );
};
