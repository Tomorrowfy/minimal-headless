import { Subscriptions } from "@/lib/eversubs/storefront/get-subscriptions";

export type CustomerInfo = {
  email?: string;
  email_verified?: boolean;
  sub?: string;
  sid?: string;
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
};

export const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
export const ACCOUNT_PORTAL_URL = SHOP_DOMAIN
  ? `https://${SHOP_DOMAIN}/account`
  : "https://shopify.com/account";

export const formatUnixSeconds = (value?: number) => {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value * 1000));
  } catch {
    return String(value);
  }
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const formatPrice = (
  amount?: string | number | null,
  currencyCode?: string | null
) => {
  if (amount == null || currencyCode == null) {
    return null;
  }

  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currencyCode}`;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(numericAmount);
  } catch {
    return `${numericAmount} ${currencyCode}`;
  }
};

export const formatInterval = (
  interval?: string | null,
  intervalCount?: number | null
) => {
  if (!interval) {
    return null;
  }

  const count = intervalCount && intervalCount > 0 ? intervalCount : 1;
  const normalized = interval.toLowerCase();
  const pluralized =
    count === 1
      ? normalized.replace(/s$/, "")
      : `${count} ${normalized}${normalized.endsWith("s") ? "" : "s"}`;

  return `Every ${pluralized}`;
};

export const resolveSubscriptionTitle = (
  subscription: Subscriptions[number]
) => {
  const firstLine = subscription.lines?.[0];

  return firstLine?.title || "Subscription";
};

export const formatPaymentMethod = (subscription: Subscriptions[number]) => {
  const instrument = subscription.customer_payment_method?.instrument;

  if (!instrument) {
    return null;
  }

  const number = instrument.masked_number;
  const email = instrument.paypal_account_email;

  const brand = number ? "Credit Card" : email ? "PayPal" : "Saved Payment";

  return `${brand} ${number || email}`;
};
