import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISignState {
  signed: boolean;
  isSigning: boolean;
}

const initialState: ISignState = {
  signed: false,
  isSigning: false,
};

export const signSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {
    setSign: (state: ISignState, action: PayloadAction<boolean>) => {
      state.signed = action.payload;
    },
    setIsSigning: (state: ISignState, action: PayloadAction<boolean>) => {
      state.isSigning = action.payload;
    },
  },
});

export const { actions: signActions, reducer: signReducer } = signSlice;
