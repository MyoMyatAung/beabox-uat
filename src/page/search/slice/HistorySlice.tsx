import { createSlice } from "@reduxjs/toolkit";

interface HistoryState {
  data: any[];
}

const initialState: HistoryState = {
  data: [],
};

export const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistoryData: (state, action) => {
      const { data } = action.payload;
      const existingDataIndex = state.data.findIndex((item) => item === data);
      if (existingDataIndex === -1) {
        state.data = [data, ...state.data];
      }
      if (state.data.length > 20) {
        state.data.pop();
      }
    },
    clearData: (state, action) => {
      const { data } = action.payload;
      state.data = state.data.filter((item) => item !== data);
    },
  },
});

export const { setHistoryData, clearData } = HistorySlice.actions;

export const selectHistoryData = (state: any) => state.history.data;

export default HistorySlice.reducer;
