import { getCustomerInfo } from "@/lib/customer/session";
import { getToken } from "./get-token";
import { Subscriptions } from "./types";

export const getSubscriptions = async () => {
  const customerInfo = await getCustomerInfo();

  if (!customerInfo?.sub) {
    return [];
  }

  const token = await getToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EVERSUBS_STOREFRONT_API_URL}/v1/subscriptions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Storefront-API-Token": token,
      },
    }
  );

  const data = (await response.json()) as {
    subscriptions: Subscriptions;
    next_cursor: "string";
    message: "string";
  };

  return data.subscriptions;
};
