"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  ICategoryCreateActions,
  ICategoryCreateState,
  IPropsStore,
} from "./types";

const CategoryCreateStateContext = createContext<ICategoryCreateState | null>(
  null,
);

const CategoryCreateActionsContext =
  createContext<ICategoryCreateActions | null>(null);

export const CategoryCreateProvider = ({ children }: IPropsStore) => {
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
    <CategoryCreateStateContext.Provider value={state}>
      <CategoryCreateActionsContext.Provider value={actions}>
        {children}
      </CategoryCreateActionsContext.Provider>
    </CategoryCreateStateContext.Provider>
  );
};

export const useCategoryCreateState = () => {
  const context = useContext(CategoryCreateStateContext);

  if (!context) {
    throw new Error(
      "useCategoryCreateState must be used within CategoryCreateProvider",
    );
  }

  return context;
};

export const useCategoryCreateActions = () => {
  const context = useContext(CategoryCreateActionsContext);

  if (!context) {
    throw new Error(
      "useCategoryCreateActions must be used within CategoryCreateProvider",
    );
  }

  return context;
};
