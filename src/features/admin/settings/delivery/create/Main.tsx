import { memo } from "react";

import { CreateDeliveryZoneForm } from "./form";
import { DeliveryZoneGraph } from "./Graph";
import { DeliveryZoneCreateProvider } from "./store";
import { IProps } from "./types";

const Create = ({ zones }: IProps) => {
  return (
    <DeliveryZoneCreateProvider>
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        <CreateDeliveryZoneForm zones={zones} />

        <DeliveryZoneGraph zones={zones} />
      </div>
    </DeliveryZoneCreateProvider>
  );
};

export default memo(Create);
