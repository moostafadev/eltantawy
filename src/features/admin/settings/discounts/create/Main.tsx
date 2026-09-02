import { memo } from "react";

import { CreateDiscountForm } from "./form";

const Create = () => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <CreateDiscountForm />
    </div>
  );
};

export default memo(Create);
