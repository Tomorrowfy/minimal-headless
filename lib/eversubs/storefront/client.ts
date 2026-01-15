import type { paths } from "@/lib/eversubs/storefront/schema";
import createClient from "openapi-fetch";
import { getToken } from "./get-token";

export const getEversubsStorefrontClient = async () => {
  const token = await getToken();

  const client = createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_EVERSUBS_STOREFRONT_API_URL,
    headers: {
      "Content-Type": "application/json",
      "X-Storefront-API-Token": token,
    },
  });

  return client;
};
