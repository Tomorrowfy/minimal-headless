# Developer and Operator Guide

This document covers setup for developers and store operators who need to run
the headless app, enable Eversubs, and make Merchant/Storefront API calls.

## Quickstart (local development)

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file based on `.env.example` and fill in required values.

3. Start the dev server:

```bash
pnpm dev
```

The app runs on `http://localhost:3000`.

## Environment variables

### Core Shopify storefront

Required for the storefront to work:

- `SHOPIFY_STORE_DOMAIN`: your Shopify domain (e.g. `your-store.myshopify.com`).
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Storefront API token.
- `SITE_NAME`, `COMPANY_NAME`: UI labels.
- `SHOPIFY_REVALIDATION_SECRET`: used for on-demand revalidation (optional in
  local dev but recommended in production).

### Customer account login (optional)

Required if you want customer login and account pages:

- `NEXT_PUBLIC_APP_URL`: public https URL of this app (required by OAuth).
- `NEXT_PUBLIC_HEADLESS_ID`: OAuth client id for Customer Accounts.
- `SHOPIFY_CUSTOMER_ACCOUNT_AUTH_URL`: OAuth authorization endpoint.
- `SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL`: OAuth token endpoint.
- `SHOPIFY_CUSTOMER_ACCOUNT_GRAPHQL_URL`: Customer Account API GraphQL endpoint.
- `SHOPIFY_CUSTOMER_ACCOUNT_SCOPE`: OAuth scope (for example:
  `openid email customer-account-api:full`).
- `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET`: required for confidential OAuth
  clients (if applicable).

Optional:

- `SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL`: logout endpoint for redirecting users
  after sign out.

### Eversubs integration

Required for subscription management and storefront API calls:

- `EVERSUBS_MERCHANT_API_URL`: Merchant API base URL.
- `EVERSUBS_MERCHANT_API_KEY`: Merchant API key.
- `NEXT_PUBLIC_EVERSUBS_STOREFRONT_API_URL`: Storefront API base URL.
- `NEXT_PUBLIC_STORE_NAME`: Eversubs store name (used when minting storefront
  tokens).

#### Getting a Merchant API key

1. Log in to your Shopify admin.
2. Go to Eversubs -> Settings -> API & access.
3. In the "Tokens" section, click "Create" in the "Merchant API Keys" block.
4. Copy the key and set it as `EVERSUBS_MERCHANT_API_KEY`.

## Running in production

Build and run:

```bash
pnpm build
pnpm start
```

Set all environment variables in your hosting provider (Vercel or equivalent).

## Enabling Eversubs

1. Add the Eversubs environment variables (see above).
2. Ensure customer login is configured, because Eversubs tokens are minted after
   a customer authenticates.
3. The login callback (`app/account/callback/route.ts`) requests a storefront
   token via the Merchant API and stores it in a secure cookie. Subsequent
   storefront API calls reuse this token.

## Making Eversubs API calls

### Merchant API

Use `lib/eversubs/merchant/client.ts` to call Merchant endpoints:

```ts
import { getEversubsMerchantClient } from "@/lib/eversubs/merchant/client";

export const fetchStorefrontToken = async (store: string, customerId: string) => {
  const client = await getEversubsMerchantClient();
  const response = await client.POST("/v1/customers/storefront-tokens", {
    body: { customer_id: customerId, store },
  });

  if (response.error) throw response.error;
  return response.data;
};
```

### Storefront API (server-side with customer token)

Use `lib/eversubs/storefront/client.ts` to call Storefront endpoints. The client
adds the `X-Storefront-API-Token` header from the cookie or by minting a token
via the Merchant API:

```ts
import { getEversubsStorefrontClient } from "@/lib/eversubs/storefront/client";

export const getSubscriptions = async () => {
  const client = await getEversubsStorefrontClient();
  const response = await client.GET("/v1/subscriptions");

  if (response.error) throw response.error;
  return response.data.subscriptions;
};
```

### Updating API types

The OpenAPI schemas live in:

- `lib/eversubs/merchant/schema.ts`
- `lib/eversubs/storefront/schema.ts`

These OpenAPI-generated schemas give you fully typed responses for every call
made through the Eversubs clients.

Regenerate types when the APIs change:

```bash
pnpm codegen:merchant
pnpm codegen:storefront
```

These scripts download schemas, so they require network access.

## API documentation

- Storefront API: `https://storefront-api.eversubs.tomorrowfy.com/redoc`
- Merchant API: `https://merchant-api.eversubs.tomorrowfy.com/redoc`
