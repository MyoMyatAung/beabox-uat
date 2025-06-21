// hooks/useVideoIndices.ts

import { useDispatch, useSelector } from "react-redux";

import { setCurrentVideoIndex } from "@/page/home/services/indexSlice";

export const useVideoIndices = () => {
  const dispatch = useDispatch();
  const currentVideoIndexMap = useSelector(
    (state: any) => state.indexSlice.currentVideoIndexMap
  );

  const setCurrentIndex = (userId: string, index: number) => {
    dispatch(setCurrentVideoIndex({ userId, index }));
  };

  return { currentVideoIndexMap, setCurrentIndex };
};
