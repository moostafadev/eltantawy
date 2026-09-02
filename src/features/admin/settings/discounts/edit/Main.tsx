import { memo } from "react";

import { EditDiscountForm } from "./form";
import { IProps } from "./types";

const Edit = ({ discount }: IProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <EditDiscountForm discount={discount} />
    </div>
  );
};

export default memo(Edit);
