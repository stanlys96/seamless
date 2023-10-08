import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReferralState {
  isValid: boolean;
  referralCode: string;
}

const initialState: IReferralState = {
  isValid: false,
  referralCode: "",
};

export const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    setIsValid: (state: IReferralState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setReferralCode: (state: IReferralState, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
  },
});

export const { actions: referralActions, reducer: referralReducer } =
  referralSlice;
