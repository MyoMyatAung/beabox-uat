import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPasswordCorrect: false,
  passwordExpirationTime: null as number | null,
};

export const passwordSlice = createSlice({
  name: "passwordSlice",
  initialState,
  reducers: {
    setIsPasswordCorrect: (state, { payload }) => {
      state.isPasswordCorrect = payload;
      if (payload) {
        state.passwordExpirationTime = Date.now() + 24 * 60 * 60 * 1000;
      } else {
        state.passwordExpirationTime = null;
      }
    },
    checkPasswordExpiration: (state) => {
      if (state.isPasswordCorrect && state.passwordExpirationTime) {
        const currentTime = Date.now();
        if (currentTime >= state.passwordExpirationTime) {
          state.isPasswordCorrect = false;
          state.passwordExpirationTime = null;
        }
      }
    },
    resetPasswordState: (state) => {
      state.isPasswordCorrect = false;
      state.passwordExpirationTime = null;
    },
  },
});

export const {
  setIsPasswordCorrect,
  checkPasswordExpiration,
  resetPasswordState,
} = passwordSlice.actions;
export default passwordSlice.reducer;
