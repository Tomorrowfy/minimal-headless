import { CreateStorefrontTokenResponse } from "./types";

export const getStorefrontToken = async (store: string, customerId: string) => {
  const response = await fetch(
    `${process.env.EVERSUBS_MERCHANT_API_URL}/v1/customers/storefront-tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.EVERSUBS_MERCHANT_API_KEY!,
      },
      body: JSON.stringify({
        store,
        customer_id: customerId,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Eversubs Merchant API request failed (${response.status}): ${body}`
    );
  }

  return (await response.json()) as CreateStorefrontTokenResponse;
};
