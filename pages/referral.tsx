"use client";
import { MainLayout } from "@/src/layouts/Main";
import useSWR from "swr";
import { fetcherStrapi, axiosStrapi } from "@/utils/axios";
import { useEffect, useRef, useState } from "react";
import { useEthers } from "@usedapp/core";
import { allTokenData, chainData, existBankData } from "@/utils/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { Pagination, ConfigProvider } from "antd";
import { useAccount } from "wagmi";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";

export default function TransactionPage() {
  const [currentTab, setCurrentTab] = useState<"Traders" | "Affiliates">(
    "Affiliates"
  );
  const [loading, setLoading] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [code, setCode] = useState("");
  const scrollToTop = useRef<HTMLInputElement>(null);
  const theme = useSelector((state: RootState) => state.theme);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const { account } = useEthers();
  const [userTransactions, setUserTransactions] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: transactionsData } = useSWR(
    `/api/transaction-histories?sort[0]=id:desc&filters[wallet_address][$eq]=${address}&pagination[page]=${currentPage}&pagination[pageSize]=8`,
    fetcherStrapi
  );
  const { data: codesData, mutate: codesMutate } = useSWR(
    `/api/referral-codes?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );
  const { data: referralsData, mutate: referralsMutate } = useSWR(
    `/api/wallets-referreds?filters[wallet_address][$eq]=${address}&populate=*`,
    fetcherStrapi
  );
  useEffect(() => {
    if (
      transactionsData &&
      transactionsData.data &&
      transactionsData.data.data.length > 0
    ) {
      const transactionsResult = transactionsData.data.data;
      setUserTransactions(transactionsResult);
    }
    if (transactionsData?.data.data.length < 1) {
      setUserTransactions([]);
    }
    setPageLoading(false);
  }, [transactionsData, account]);
  return (
    <MainLayout>
      <div ref={scrollToTop}>
        <div
          className={`md:px-[100px] font-bold text-xl ${
            theme.theme === "light" ? "text-dark" : "text-white"
          }`}
        >
          <div className="px-[50px] md:px-[0px] mt-3">
            <p>Referrals</p>
            <p className="text-gray md:w-1/2 text-[16px] leading-6">
              Get fee discounts and earn rebates through the GMX referral
              program. For more information, please read the referral program
              details.
            </p>
          </div>
          <div className="flex justify-center mt-[50px]">
            <button
              onClick={() => {
                setCurrentTab("Traders");
                if (currentTab !== "Traders") {
                  setCode("");
                }
              }}
              className={`${
                currentTab === "Traders" ? "bg-[#2C42FC]" : "bg-gray"
              }  px-[15px] py-[5px] text-white rounded-l-md`}
            >
              Traders
            </button>
            <button
              onClick={() => {
                setCurrentTab("Affiliates");
                if (currentTab !== "Affiliates") {
                  setCode("");
                }
              }}
              className={`${
                currentTab === "Affiliates" ? "bg-[#2C42FC]" : "bg-gray"
              } px-[15px] py-[5px] text-white rounded-r-md`}
            >
              Affiliates
            </button>
          </div>
          {currentTab === "Traders" &&
            (referralsData?.data?.data?.length === 0 ? (
              <div
                className={`${
                  theme.theme === "light"
                    ? "primary-container"
                    : "primary-container-dark"
                } flex flex-col justify-center items-center h-full px-[50px] py-[25px] mt-[25px] mx-[50px] md:mx-[200px]`}
              >
                <p>Enter Referral Code</p>
                <p className="mt-2 text-center">
                  Please input a referral code to benefit from fee discounts.
                </p>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  className="w-full input-border rounded-[8px] mt-5 focus-visible:outline-none border-gray-400 mx-[200px] p-[10px] bg-transparent focus-none"
                  type="text"
                />
                <button
                  disabled={loading}
                  onClick={async () => {
                    if (!address) {
                      return Swal.fire(
                        "Info!",
                        "Please connect your wallet!",
                        "info"
                      );
                    }
                    if (!code || code.length < 3) {
                      return Swal.fire(
                        "Info!",
                        "Please enter a code, at least 3 characters!",
                        "info"
                      );
                    }
                    try {
                      setLoading(true);
                      let found = false;
                      const codes = await axiosStrapi.get(
                        "/api/referral-codes"
                      );
                      const codesData = codes.data.data;
                      let currentData;
                      for (let i = 0; i < codesData.length; i++) {
                        if (codesData[i].attributes.code === code) {
                          found = true;
                          currentData = codesData[i];
                        }
                      }
                      if (!found) {
                        setLoading(false);
                        return Swal.fire(
                          "Info!",
                          "Code does not exist!",
                          "info"
                        );
                      }

                      if (currentData.attributes.wallet_address === address) {
                        setLoading(false);
                        return Swal.fire(
                          "Info!",
                          "Cannot refer to your own code!",
                          "info"
                        );
                      }

                      await axiosStrapi.post("/api/wallets-referreds", {
                        data: {
                          referral_code: currentData.id,
                          wallet_address: address,
                        },
                      });
                      setCode("");
                      setLoading(false);
                      referralsMutate();
                      return Swal.fire(
                        "Success!",
                        "Successfully registered the referral!",
                        "success"
                      );
                    } catch (e) {
                      setLoading(false);
                      console.log(e);
                    }
                  }}
                  className={`mainBtn ${
                    theme.theme === "dark" ? "text-white" : "text-black"
                  } mt-3 w-full leading-[24px] px-4 py-[13px] flex items-center justify-center`}
                >
                  {loading ? (
                    <Bars
                      height="24"
                      width="48"
                      color="#4fa94d"
                      ariaLabel="bars-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  ) : (
                    "Enter Referral Code"
                  )}
                </button>
              </div>
            ) : (
              <div
                className={`${
                  theme.theme === "light"
                    ? "primary-container"
                    : "primary-container-dark"
                } flex flex-col justify-center items-center h-full px-[50px] py-[25px] mt-[25px] mx-[50px] md:mx-[200px]`}
              >
                <p className="mt-2 text-center">
                  You have referred to a code:{" "}
                  <span className="underline">
                    {
                      referralsData?.data?.data[0]?.attributes?.referral_code
                        ?.data?.attributes?.code
                    }
                  </span>{" "}
                </p>
              </div>
            ))}
          {currentTab === "Affiliates" && (
            <div
              className={`${
                theme.theme === "light"
                  ? "primary-container"
                  : "primary-container-dark"
              } flex flex-col justify-center items-center h-full md:px-[50px] py-[25px] mt-[25px] mx-[50px] md:mx-[200px]`}
            >
              {codesData?.data?.data?.length === 0 || !address ? (
                <div>
                  <p className="text-center">Generate Referral Code</p>
                  <p className="mt-2 text-center">
                    Looks like you don&apos;t have a referral code to share.
                    Create one now and start earning rebates!
                  </p>
                  <input
                    disabled={codesData?.data?.data?.length !== 0}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    className="w-full input-border rounded-[8px] mt-5 focus-visible:outline-none border-gray-400  p-[10px] bg-transparent focus-none"
                    type="text"
                  />
                  <button
                    disabled={loading || codesData?.data?.data?.length !== 0}
                    onClick={async () => {
                      if (!address) {
                        return Swal.fire(
                          "Info!",
                          "Please connect your wallet!",
                          "info"
                        );
                      }
                      if (!code || code.length < 3) {
                        return Swal.fire(
                          "Info!",
                          "Please enter a code, at least 3 characters!",
                          "info"
                        );
                      }
                      try {
                        setLoading(true);
                        const codes = await axiosStrapi.get(
                          "/api/referral-codes"
                        );
                        const codesData = codes.data.data;
                        for (let i = 0; i < codesData.length; i++) {
                          if (codesData[i].attributes.code === code) {
                            setLoading(false);
                            return Swal.fire(
                              "Info!",
                              "Code already exists! Please choose another code!",
                              "info"
                            );
                          }
                        }
                        await axiosStrapi.post("/api/referral-codes", {
                          data: { code, wallet_address: address },
                        });
                        setLoading(false);
                        setCode("");
                        codesMutate();
                        return Swal.fire(
                          "Success!",
                          "Successfully generated code!",
                          "success"
                        );
                      } catch (e) {
                        setLoading(false);
                        console.log(e);
                      }
                    }}
                    className={`mainBtn ${
                      theme.theme === "dark" ? "text-white" : "text-black"
                    } mt-3 w-full leading-[24px] px-4 py-[13px] flex items-center justify-center`}
                  >
                    {loading ? (
                      <Bars
                        height="24"
                        width="48"
                        color="#4fa94d"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    ) : (
                      "Enter a code"
                    )}
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-center">
                  You have generated a referral code! Use the code{" "}
                  <span className="underline">
                    {codesData?.data?.data[0]?.attributes?.code}
                  </span>{" "}
                  for others to use so you get benefits!{" "}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
