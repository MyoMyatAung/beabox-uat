import { EventDetail } from "@/@types/lucky_draw";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentState {
  isShowAnimation: boolean,
  eventDetail: EventDetail | null,
  event_start_time: number; 
}

const initialState: CurrentState = {
  isShowAnimation: false,
  eventDetail: null,
  event_start_time: 0
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
    setDuration(state, action: PayloadAction<number>) {
      state.event_start_time = action.payload; // <-- ADD this
    },
    decrementDuration: (state) => {
      if (state.event_start_time > 0) {
        state.event_start_time -= 1000;
      }
    }    
  },
});

export const { setAnimation ,setEventDetail, setDuration, decrementDuration } = currentSlice.actions;
export default currentSlice.reducer;
