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

  const total =
    cart.subtotal - cart.discount - cart.discountAmount + deliveryFee;

  return (
    <div className="grid gap-3 lg:gap-4 lg:grid-cols-[1fr_360px]">
      <div className="block lg:hidden">
        <CheckoutSummary
          deliveryFee={deliveryFee}
          total={total}
          hasZone={Boolean(selectedZone)}
        />
      </div>
      <CheckoutForm zones={zones} onZoneChange={setSelectedZoneId} />

      <CheckoutSummary
        deliveryFee={deliveryFee}
        total={total}
        hasZone={Boolean(selectedZone)}
      />
    </div>
  );
};

export default Checkout;
