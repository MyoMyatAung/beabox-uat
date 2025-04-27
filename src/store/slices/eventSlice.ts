import { EventDetail } from "@/@types/lucky_draw";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentState {
  eventData: any | null; // you can replace `any` with your real event type
  eventDetail: EventDetail | null
}

const initialState: CurrentState = {
  eventData: null,
  eventDetail: null
};

const currentSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventDetail(state, action: PayloadAction<EventDetail>) {
        state.eventDetail = action.payload;
      },
  },
});

export const { setEventDetail } = currentSlice.actions;
export default currentSlice.reducer;
