"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  payload: {
    selectedVariantId: string | undefined;
    sellingPlanId?: string | null;
  }
) {
  const { selectedVariantId, sellingPlanId } = payload;

  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([
      {
        merchandiseId: selectedVariantId,
        quantity: 1,
        sellingPlanId,
      },
    ]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(
  prevState: any,
  payload: { merchandiseId: string; sellingPlanId?: string | null }
) {
  const { merchandiseId, sellingPlanId } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        (line.sellingPlanAllocation?.sellingPlan.id ?? null) ===
          (sellingPlanId ?? null)
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
    sellingPlanId?: string | null;
  }
) {
  const { merchandiseId, quantity, sellingPlanId } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) =>
        line.merchandise.id === merchandiseId &&
        (line.sellingPlanAllocation?.sellingPlan.id ?? null) ===
          (sellingPlanId ?? null)
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
            sellingPlanId,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity, sellingPlanId }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
