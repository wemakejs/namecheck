import { createSlice } from "@reduxjs/toolkit";

export const usernameSlice = createSlice({
  name: "username",
  initialState: "",
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export const { set } = usernameSlice.actions;
