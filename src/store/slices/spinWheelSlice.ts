import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpinWheelState {
  prizes: any[];
  currentEvent: any;
  profile: any;
  isInitialized: boolean;
}

const initialState: SpinWheelState = {
  prizes: [],
  currentEvent: null,
  profile: null,
  isInitialized: false,
};

const spinWheelSlice = createSlice({
  name: 'spinWheel',
  initialState,
  reducers: {
    setPrizes: (state, action: PayloadAction<any[]>) => {
      state.prizes = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<any>) => {
      state.currentEvent = action.payload;
    },
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setPrizes, setCurrentEvent, setProfile, setInitialized } = spinWheelSlice.actions;
export default spinWheelSlice.reducer; 