import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IThemeState {
  theme: "light" | "dark";
}

const initialState: IThemeState = {
  theme: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state: IThemeState, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { actions: themeActions, reducer: themeReducer } = themeSlice;
