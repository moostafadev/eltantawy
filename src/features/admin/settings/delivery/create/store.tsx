"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  IDeliveryZoneCreateActions,
  IDeliveryZoneCreateState,
  IPropsStore,
} from "./types";

export const DeliveryZoneCreateStateContext =
  createContext<IDeliveryZoneCreateState | null>(null);

const DeliveryZoneCreateActionsContext =
  createContext<IDeliveryZoneCreateActions | null>(null);

export const DeliveryZoneCreateProvider = ({ children }: IPropsStore) => {
  const [selectedParentId, setSelectedParentIdState] = useState("");

  const setSelectedParentId = useCallback((id: string) => {
    setSelectedParentIdState(id);
  }, []);

  const state = useMemo(
    () => ({
      selectedParentId,
    }),
    [selectedParentId],
  );

  const actions = useMemo(
    () => ({
      setSelectedParentId,
    }),
    [setSelectedParentId],
  );

  return (
    <DeliveryZoneCreateStateContext.Provider value={state}>
      <DeliveryZoneCreateActionsContext.Provider value={actions}>
        {children}
      </DeliveryZoneCreateActionsContext.Provider>
    </DeliveryZoneCreateStateContext.Provider>
  );
};

export const useDeliveryZoneCreateState = () => {
  const context = useContext(DeliveryZoneCreateStateContext);

  if (!context) {
    throw new Error(
      "useDeliveryZoneCreateState must be used within DeliveryZoneCreateProvider",
    );
  }

  return context;
};

export const useDeliveryZoneCreateActions = () => {
  const context = useContext(DeliveryZoneCreateActionsContext);

  if (!context) {
    throw new Error(
      "useDeliveryZoneCreateActions must be used within DeliveryZoneCreateProvider",
    );
  }

  return context;
};
