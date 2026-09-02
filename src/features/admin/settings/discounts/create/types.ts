import { z } from "zod";

import { createDiscountSchema } from "./form/schema";

export type CreateDiscountFormValues = z.infer<typeof createDiscountSchema>;
