import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasDecryptedInitialData: false, // Track if initial decryption is done
};

const decryptionSlice = createSlice({
  name: "decryption",
  initialState,
  reducers: {
    setHasDecryptedInitialData: (state, action) => {
      state.hasDecryptedInitialData = action.payload;
    },
  },
});

export const { setHasDecryptedInitialData } = decryptionSlice.actions;
export default decryptionSlice.reducer;
