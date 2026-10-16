"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/lib/cart/provider";

import CheckoutForm from "./form/Main";
import CheckoutSummary from "./CheckoutSummary";
import { IProps } from "./types";

const Checkout = ({ zones }: IProps) => {
  const { cart } = useCart();
  const [selectedZoneId, setSelectedZoneId] = useState("");

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === selectedZoneId),
    [zones, selectedZoneId],
  );

  const deliveryFee = selectedZone?.cost ?? 0;

  /*
   * Exact total, used when the cart has no weight-range items. When the
   * cart does contain approximate items we also compute the min/max range
   * and let the summary display it instead.
   */
  const total =
    cart.subtotal - cart.discount - cart.discountAmount + deliveryFee;

  /*
   * The cart's min/max already include product-level and code-level
   * discounts; the delivery fee is added here so the range reflects the
   * final payable amount.
   */
  const minTotal = cart.minTotal + deliveryFee;
  const maxTotal = cart.maxTotal + deliveryFee;

  return (
    <div className="grid gap-3 lg:gap-4 lg:grid-cols-[1fr_360px]">
      <div className="block lg:hidden">
        <CheckoutSummary
          deliveryFee={deliveryFee}
          total={total}
          minTotal={minTotal}
          maxTotal={maxTotal}
          hasApproxItems={cart.hasApproxItems}
          hasZone={Boolean(selectedZone)}
        />
      </div>

      <CheckoutForm zones={zones} onZoneChange={setSelectedZoneId} />

      <CheckoutSummary
        deliveryFee={deliveryFee}
        total={total}
        minTotal={minTotal}
        maxTotal={maxTotal}
        hasApproxItems={cart.hasApproxItems}
        hasZone={Boolean(selectedZone)}
      />
    </div>
  );
};

export default Checkout;
