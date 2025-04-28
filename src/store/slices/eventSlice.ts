import { EventDetail } from "@/@types/lucky_draw";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentState {
  isShowAnimation: boolean,
  eventDetail: EventDetail | null
}

const initialState: CurrentState = {
  isShowAnimation: false,
  eventDetail: null
};

const currentSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setAnimation(state, action) {
      state.isShowAnimation = action.payload
    },
    setEventDetail(state, action: PayloadAction<EventDetail>) {
        state.eventDetail = action.payload;
    },
  },
});

export const { setAnimation ,setEventDetail } = currentSlice.actions;
export default currentSlice.reducer;
