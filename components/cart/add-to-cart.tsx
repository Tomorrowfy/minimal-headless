"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import Price from "components/price";
import { Product, ProductVariant, SellingPlan } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState<
    string | null
  >(null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, {
    selectedVariantId,
    sellingPlanId: selectedSellingPlanId,
  });
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );
  const baseVariant = finalVariant ?? variants[0];
  const sellingPlans = useMemo(
    () =>
      product.sellingPlanGroups.flatMap((group) => group.sellingPlans ?? []),
    [product.sellingPlanGroups]
  );
  const selectedSellingPlan =
    sellingPlans.find((plan) => plan.id === selectedSellingPlanId) ?? null;

  const planPricing = useMemo(() => {
    if (!baseVariant) {
      return [];
    }

    const baseAmount = Number(baseVariant.price.amount);
    const currencyCode = baseVariant.price.currencyCode;

    const computePriceForPlan = (plan: SellingPlan) => {
      const adjustment = plan.priceAdjustments[0]?.adjustmentValue;
      if (!adjustment || Number.isNaN(baseAmount)) {
        return { discountPercentage: 0, amount: baseAmount };
      }

      if (adjustment.__typename === "SellingPlanPercentagePriceAdjustment") {
        const discountPercentage = adjustment.adjustmentPercentage ?? 0;
        const amount = baseAmount * (1 - discountPercentage / 100);
        return { discountPercentage, amount };
      }

      if (adjustment.__typename === "SellingPlanFixedAmountPriceAdjustment") {
        const discountAmount = Number(adjustment.adjustmentAmount?.amount ?? 0);
        const amount = baseAmount - discountAmount;
        const discountPercentage = baseAmount
          ? (discountAmount / baseAmount) * 100
          : 0;
        return { discountPercentage, amount };
      }

      if (adjustment.__typename === "SellingPlanFixedPriceAdjustment") {
        const fixedPrice = Number(adjustment.price?.amount ?? baseAmount);
        const discountPercentage = baseAmount
          ? ((baseAmount - fixedPrice) / baseAmount) * 100
          : 0;
        return { discountPercentage, amount: fixedPrice };
      }

      return { discountPercentage: 0, amount: baseAmount };
    };

    return sellingPlans.map((plan) => {
      const pricing = computePriceForPlan(plan);
      return {
        id: plan.id,
        name: plan.name,
        discountPercentage: Math.max(0, Math.round(pricing.discountPercentage)),
        amount: Math.max(0, pricing.amount),
        currencyCode,
      };
    });
  }, [baseVariant, sellingPlans]);

  return (
    <form
      action={async () => {
        if (!finalVariant) {
          return;
        }

        addCartItem(finalVariant, product, selectedSellingPlan);
        addItemAction();
      }}
    >
      {sellingPlans.length > 0 && baseVariant ? (
        <div className="mb-6">
          <div className="flex flex-col rounded-2xl divide-y divide-neutral-200 border border-neutral-200 dark:border-neutral-700 overflow-clip">
            <label
              className={clsx(
                "flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition hover:bg-blue-100",
                {
                  "bg-blue-200!": selectedSellingPlanId === null,
                }
              )}
            >
              <span className="font-medium">One time purchase</span>
              <span className="flex items-center gap-3 text-right">
                <span className="text-neutral-500 dark:text-neutral-400">
                  0%
                </span>
                <Price
                  amount={baseVariant.price.amount}
                  currencyCode={baseVariant.price.currencyCode}
                />
              </span>
              <input
                className="sr-only"
                type="radio"
                name="selling-plan"
                value="one-time"
                checked={selectedSellingPlanId === null}
                onChange={() => setSelectedSellingPlanId(null)}
              />
            </label>
            {planPricing.map((plan) => (
              <label
                key={plan.id}
                className={clsx(
                  "flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition hover:bg-blue-100",
                  {
                    "bg-blue-200!": selectedSellingPlanId === plan.id,
                  }
                )}
              >
                <span className="font-medium">{plan.name}</span>
                <span className="flex items-center gap-3 text-right">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {plan.discountPercentage}%
                  </span>
                  <Price
                    amount={plan.amount.toString()}
                    currencyCode={plan.currencyCode}
                  />
                </span>
                <input
                  className="sr-only"
                  type="radio"
                  name="selling-plan"
                  value={plan.id}
                  checked={selectedSellingPlanId === plan.id}
                  onChange={() => setSelectedSellingPlanId(plan.id)}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
