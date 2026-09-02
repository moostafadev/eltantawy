import { memo } from "react";

import { EditDeliveryZoneForm } from "./form";
import { DeliveryZoneGraph } from "../create/Graph";
import { IProps } from "./types";

const Edit = ({ zone, zones }: IProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <EditDeliveryZoneForm zone={zone} zones={zones} />

      <DeliveryZoneGraph zones={zones} selectedId={zone.id} />
    </div>
  );
};

export default memo(Edit);
