import {
  getCustomerInfo,
  setEversubsStorefrontToken,
} from "@/lib/customer/session";
import { getStorefrontToken } from "@/lib/eversubs/merchant/get-storefront-token";
import { NextResponse } from "next/server";

export async function GET() {
  const customerInfo = await getCustomerInfo();

  const eversubsStorefrontToken = await getStorefrontToken(
    process.env.NEXT_PUBLIC_STORE_NAME!,
    `gid://shopify/Customer/${customerInfo?.sub}`
  );

  await setEversubsStorefrontToken(eversubsStorefrontToken.token);

  return NextResponse.json(eversubsStorefrontToken);
}
