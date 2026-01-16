import { getEversubsMerchantClient } from "./client";

export const fetchStorefrontToken = async (
  store: string,
  customerId: string
) => {
  const merchantClient = await getEversubsMerchantClient();

  const response = await merchantClient.POST(
    "/v1/customers/storefront-tokens",
    {
      body: {
        customer_id: customerId,
        store,
      },
    }
  );

  if (response.error) {
    throw response.error;
  }

  return response.data;
};

export type StorefrontToken = Awaited<ReturnType<typeof fetchStorefrontToken>>;
