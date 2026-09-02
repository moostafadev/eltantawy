import { z } from "zod";

import { createDeliveryZoneSchema } from "./form/schema";

type CreateDeliveryZoneFormValues = z.infer<typeof createDeliveryZoneSchema>;

interface IDeliveryZoneParent {
  id: string;
  title: string;
  parentId: string | null;
  cost: number | null;
  isActive: boolean;
  _count: {
    children: number;
  };
}

interface IProps {
  zones: IDeliveryZoneParent[];
}

interface IDeliveryZoneCreateContextValue {
  selectedParentId: string;
  setSelectedParentId: (id: string) => void;
}

interface IPropsStore {
  children: React.ReactNode;
}

interface IDeliveryZoneCreateState {
  selectedParentId: string;
}

interface IDeliveryZoneCreateActions {
  setSelectedParentId: (id: string) => void;
}

export type {
  IDeliveryZoneParent,
  IProps,
  CreateDeliveryZoneFormValues,
  IDeliveryZoneCreateContextValue,
  IPropsStore,
  IDeliveryZoneCreateState,
  IDeliveryZoneCreateActions,
};
