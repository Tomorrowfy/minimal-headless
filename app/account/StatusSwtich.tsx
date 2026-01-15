"use client";

import { cancelSubscription } from "@/lib/eversubs/storefront/cancel-subscription";
import { reactivateSubscription } from "@/lib/eversubs/storefront/reactivate-subscription";
import clsx from "clsx";
import {
  useOptimistic,
  useState,
  useTransition,
  type FC,
  type HTMLAttributes,
} from "react";

type StatusSwtichProps = {
  subscriptionId: string;
  status: string;
} & HTMLAttributes<HTMLDivElement>;

export const StatusSwtich: FC<StatusSwtichProps> = (props) => {
  const [, startTransition] = useTransition();

  const [realStatus, setRealStatus] = useState(props.status);
  const [optimisticStatus, setStatusOptimistically] = useOptimistic(realStatus);

  return (
    <div className="inline-flex">
      {["active", "paused"].map((status) => (
        <button
          key={status}
          className={clsx(
            "inline-flex gap-2 items-center cursor-pointer border border-neutral-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
            "first:rounded-l-full",
            "last:rounded-r-full last:border-l-0",
            "hover:bg-neutral-50",
            {
              "!bg-blue-50":
                status.toLowerCase() === optimisticStatus.toLowerCase(),
            }
          )}
          onClick={async () => {
            startTransition(async () => {
              setStatusOptimistically(status);

              if (status === "active") {
                const reactivatedSub = await reactivateSubscription(
                  props.subscriptionId
                );

                setRealStatus((s) => reactivatedSub.status ?? s);
              } else {
                const cancelledSub = await cancelSubscription(
                  props.subscriptionId,
                  "other"
                );

                setRealStatus((s) => cancelledSub.status ?? s);
              }
            });
          }}
        >
          {status}
        </button>
      ))}
    </div>
  );
};
