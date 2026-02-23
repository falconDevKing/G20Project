// debugSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const debugSlice = createSlice({
  name: "debug",
  initialState: { counter: 0 },
  reducers: {
    inc: (state) => {
      state.counter += 1;
    },
  },
});

export const { inc } = debugSlice.actions;
export default debugSlice.reducer;
