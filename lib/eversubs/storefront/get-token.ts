import { getEversubsStorefrontToken } from "@/lib/customer/session";
import {} from "./types";
import { CreateStorefrontTokenResponse } from "../merchant/types";

export const getToken = async () => {
  const storedToken = await getEversubsStorefrontToken();

  if (storedToken) {
    return storedToken;
  }

  const updatedToken = await fetch("/account/eversubs/get-storefront-token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await updatedToken.json()) as CreateStorefrontTokenResponse;

  return data.token;
};
