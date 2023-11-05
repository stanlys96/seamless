import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { referralActions } from "../stores";
import { axiosApi } from "@/utils/axios";
import Swal from "sweetalert2";

interface Props {
  referralModal: any;
}

export const ReferralModal = ({ referralModal }: Props) => {
  const dispatch = useDispatch();
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className={`${referralModal ? "block" : "hidden"}`}>
      <div
        className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm h-full w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex"
        style={{ opacity: 1 }}
      >
        <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] sm:rounded-b-xl static bottom-0 w-full h-fit">
          <div className="relative flex flex-shrink-0 border-b border-gray items-center justify-between py-2.5 px-6 sm:py-4 sm:px-6">
            <h3 className="text-lg font-medium text-socket-primary">
              Input Referral Code
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex h-fit flex-col">
              <div className="relative border-gray p-4">
                <div>
                  <div className="noScrollbar flex overflow-x-auto flex-wrap">
                    <input
                      placeholder="Referral Code"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value);
                      }}
                      className="skt-w border border-gray p-2 rounded-md skt-w-input text-socket-primary bg-transparent font-bold focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl"
                      spellCheck={false}
                      type="text"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const data = await axiosApi.get(
                        `/api/referrals?filters[referral_code][$eq]=${referralCode}`
                      );
                      if (data.data.data.length > 0) {
                        dispatch(referralActions.setIsValid(true));
                        dispatch(
                          referralActions.setReferralCode(
                            data.data.data[0].attributes.referral_code
                          )
                        );
                        dispatch(
                          referralActions.setWalletAddress(
                            data.data.data[0].attributes.referring_to
                          )
                        );
                      } else {
                        const specialData = await axiosApi.get(
                          `/api/special-wallets?filters[access_code][$eq]=${referralCode}`
                        );
                        if (specialData.data.data.length > 0) {
                          dispatch(referralActions.setIsValid(true));
                          dispatch(
                            referralActions.setReferralCode(
                              specialData.data.data[0].attributes.access_code
                            )
                          );
                          dispatch(
                            referralActions.setWalletAddress(
                              specialData.data.data[0].attributes.wallet_address
                            )
                          );
                          dispatch(referralActions.setFree(true));
                        } else {
                          Swal.fire(
                            "Referral code not registered",
                            "Referral code not registered. Please go to our discord to get one",
                            "info"
                          );
                        }
                      }
                      setLoading(false);
                    } catch (e) {
                      setLoading(false);
                      console.log(e);
                    }
                  }}
                  disabled={loading}
                  className={`mt-5 rounded font-bold ${
                    loading ? "bg-darkGray cursor-not-allowed" : "mainBtn"
                  } ${"text-black"} w-full leading-[24px] px-4 py-[10px] flex items-center justify-center`}
                >
                  {loading ? (
                    <ThreeDots
                      height="24"
                      width="48"
                      radius="9"
                      color="#4fa94d"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      visible={true}
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
