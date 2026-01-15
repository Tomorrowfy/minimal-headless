import {
  getCustomerInfo,
  getEverSubsStorefrontTokenCookie,
  setEverSubsStorefrontTokenCookie,
} from "@/lib/customer/session";
import { fetchStorefrontToken } from "../merchant/fetch-storefront-token";

export const getToken = async () => {
  const storedToken = await getEverSubsStorefrontTokenCookie();

  if (storedToken) {
    return storedToken;
  }

  const customerInfo = await getCustomerInfo();

  const tokenData = await fetchStorefrontToken(
    process.env.NEXT_PUBLIC_STORE_NAME!,
    `gid://shopify/Customer/${customerInfo?.sub}`
  );

  try {
    // need a try-catch block here
    // because if the function will be called from the RSC
    // then it will throw an error: cannot set cookies in RSC
    await setEverSubsStorefrontTokenCookie(tokenData.token);
  } catch {}

  return tokenData.token;
};
