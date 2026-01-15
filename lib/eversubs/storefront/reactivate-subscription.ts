"use server";

import { revalidatePath } from "next/cache";
import { getEversubsStorefrontClient } from "./client";

export const reactivateSubscription = async (subscriptionId: string) => {
  const storefrontClient = await getEversubsStorefrontClient();
  const response = await storefrontClient.POST("/v1/subscriptions/reactivate", {
    body: {
      subscription_id: subscriptionId,
    },
  });

  if (response.error) {
    throw response.error;
  }

  revalidatePath("/account");

  return response.data.subscription;
};

export type ReactivatedSubscription = Awaited<
  ReturnType<typeof reactivateSubscription>
>;
