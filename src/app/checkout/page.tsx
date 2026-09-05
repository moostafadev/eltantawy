import { Breadcrumb } from "@/components/breadcrumb";
import { getActiveDeliveryZonesForCheckout } from "@/features/admin/settings/delivery/table";
import { Checkout } from "@/features/client/checkout";

const CheckoutPage = async () => {
  const zones = await getActiveDeliveryZonesForCheckout();

  return (
    <main className="flex flex-1 items-stretch py-6 lg:py-8 bg-background-second/20">
      <div className="container">
        <div className="flex flex-col gap-4">
          <Breadcrumb
            items={[
              {
                label: "السلة",
                href: "/cart",
              },
              {
                label: "إتمام الطلب",
              },
            ]}
          />

          <Checkout zones={zones} />
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
