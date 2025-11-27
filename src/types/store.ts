import { RootState } from "@/store/store";

/**
 * Type-safe selector for model slice
 */
export const selectPanding = (state: RootState): boolean => {
  return state.model?.panding ?? false;
};

