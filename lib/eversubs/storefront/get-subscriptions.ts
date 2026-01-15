import { getEversubsStorefrontClient } from "./client";

export const getSubscriptions = async () => {
  const storefrontClient = await getEversubsStorefrontClient();

  const response = await storefrontClient.GET("/v1/subscriptions");

  if (response.error) {
    throw response.error;
  }

  return response.data.subscriptions;
};

export type SubscriptionsPromise = ReturnType<typeof getSubscriptions>;
export type Subscriptions = Awaited<SubscriptionsPromise>;
