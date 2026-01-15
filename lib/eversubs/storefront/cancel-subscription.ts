"use server";

import { revalidatePath } from "next/cache";
import { getEversubsStorefrontClient } from "./client";

export const cancelSubscription = async (
  subscriptionId: string,
  reason: string
) => {
  const storefrontClient = await getEversubsStorefrontClient();
  const response = await storefrontClient.POST("/v1/subscriptions/cancel", {
    body: {
      reason,
      permanent: false,
      subscription_id: subscriptionId,
      move_one_times_to_next_eligible_date: true,
    },
  });

  if (response.error) {
    throw response.error;
  }

  revalidatePath("/account", "page");

  return response.data.subscription;
};

export type CanceledSubscription = Awaited<
  ReturnType<typeof cancelSubscription>
>;
