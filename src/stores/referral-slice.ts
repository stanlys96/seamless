import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReferralState {
  isValid: boolean;
  referralCode: string;
  walletAddress: string;
  free: boolean;
}

const initialState: IReferralState = {
  isValid: false,
  referralCode: "",
  walletAddress: "",
  free: false,
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
    setWalletAddress: (
      state: IReferralState,
      action: PayloadAction<string>
    ) => {
      state.walletAddress = action.payload;
    },
    setFree: (state: IReferralState, action: PayloadAction<boolean>) => {
      state.free = action.payload;
    },
  },
});

export const { actions: referralActions, reducer: referralReducer } =
  referralSlice;
