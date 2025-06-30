// features/seenUsersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SeenUsersState {
  onlyseenUserIds: string[];
}

const initialState: SeenUsersState = {
  onlyseenUserIds: [],
};

const onlyseenUserSlice = createSlice({
  name: "onlyseenUser",
  initialState,
  reducers: {
    addOnlySeenUser: (state, action: PayloadAction<string>) => {
      if (!state.onlyseenUserIds.includes(action.payload)) {
        state.onlyseenUserIds.push(action.payload);
      }
    },
    clearOnlySeenUser: (state) => {
      state.onlyseenUserIds = [];
    },
  },
});

export const { addOnlySeenUser, clearOnlySeenUser } = onlyseenUserSlice.actions;
export default onlyseenUserSlice.reducer;
