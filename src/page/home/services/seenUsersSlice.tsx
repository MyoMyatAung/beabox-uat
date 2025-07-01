// features/seenUsersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SeenUsersState {
  seenUserIds: string[];
}

const initialState: SeenUsersState = {
  seenUserIds: [],
};

const seenUsersSlice = createSlice({
  name: "seenUsers",
  initialState,
  reducers: {
    addSeenUser: (state, action: PayloadAction<string>) => {
      if (!state.seenUserIds.includes(action.payload)) {
        state.seenUserIds.push(action.payload);
      }
    },
    clearSeenUsers: (state) => {
      state.seenUserIds = [];
    },
  },
});

export const { addSeenUser, clearSeenUsers } = seenUsersSlice.actions;
export default seenUsersSlice.reducer;
