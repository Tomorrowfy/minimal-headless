import createClient from "openapi-fetch";
import { paths } from "./schema";

export const getEversubsMerchantClient = async () => {
  const client = createClient<paths>({
    baseUrl: process.env.EVERSUBS_MERCHANT_API_URL,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.EVERSUBS_MERCHANT_API_KEY!,
    },
  });

  return client;
};
