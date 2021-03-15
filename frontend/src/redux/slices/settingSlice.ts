import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { platformGroups } from "src/data/platforms";

const initialState: Record<string, boolean> = platformGroups.reduce(
  (acc, platformGroup) => ({
    ...acc,
    ...platformGroup.platforms.reduce(
      (acc, platform) => ({
        ...acc,
        [`${platformGroup.id}.${platform.id}`]: !!platform.selectedByDefault,
      }),
      {}
    ),
  }),
  {}
);

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ id: string; value: boolean }>) => {
      const { id, value } = action.payload;
      state[id] = value;
    },
  },
});
