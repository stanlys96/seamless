"use client";
import { MainLayout } from "@/src/layouts/Main";
import useSWR from "swr";
import {
  axiosApi,
  axiosSecondary,
  fetcherFlip,
  fetcherProvinces,
  fetcherStrapi,
} from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import {
  allTokenData,
  chainData,
  existBankData,
  validateEmail,
} from "@/utils/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { Pagination, ConfigProvider, Table, Input } from "antd";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ColumnsType } from "antd/es/table";
import { eWallets } from "@/utils/helper";
import Head from "next/head";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { BankModal } from "@/src/components/BankModal";
import { ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";
import QRCode from "react-qr-code";

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  main: boolean;
  username: string;
  token: string;
  token_value: number;
  chain: number;
  idr_value: number;
  bank_name: string;
  bank_account_number: string;
}

const columns = [
  {
    title: "Destination Name",
    dataIndex: "bank_code",
    key: "bank_code",
  },
  {
    title: "Account Number",
    dataIndex: "bank_account_number",
    key: "bank_account_number",
  },
  {
    title: "Account Name",
    dataIndex: "bank_account_name",
    key: "bank_account_name",
  },
];

export default function TransactionPage() {
  const [bankModal, setBankModal] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [referralCodeLoading, setReferralCodeLoading] = useState(false);
  const [userWalletData, setUserWalletData] = useState<any>([]);
  const scrollToTop = useRef<HTMLInputElement>(null);
  const [isCheckingBankAccount, setIsCheckingBankAccount] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [currentSelectedBank, setCurrentSelectedBank] = useState({
    name: "",
    bank_code: "",
    imgUrl: "",
  });
  const [currentSecondaryBank, setCurrentSecondaryBank] = useState({
    name: "",
    bank_code: "",
    imgUrl: "",
  });
  const [isSecondaryBank, setIsSecondaryBank] = useState(false);
  const { data: banksData } = useSWR(`/banks`, fetcherFlip);
  const theme = useSelector((state: RootState) => state.theme);
  const [pageLoading, setPageLoading] = useState(false);
  const [personalInformationLoading, setPersonalInformationLoading] =
    useState(false);
  const [addDestinationLoading, setAddDestinationLoading] = useState(false);
  const router = useRouter();
  const [userTransactions, setUserTransactions] = useState<any>([]);
  const [bankAccountValue, setBankAccountValue] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: transactionsData, mutate: mutateTransactionsData } = useSWR(
    `/api/transaction-histories?sort[0]=id:desc&filters[wallet_address][$eq]=${address}&pagination[page]=${currentPage}&pagination[pageSize]=8`,
    fetcherStrapi
  );

  const [referralCode, setReferralCode] = useState("");

  const [referralTab, setReferralTab] = useState<"traders" | "affiliates">(
    "traders"
  );

  const { data: personalData, mutate: mutatePersonalData } = useSWR(
    `/api/user-wallets?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );

  const { data: referralAffiliatesData, mutate: mutateReferralAffiliates } =
    useSWR(
      `/api/referral-codes?filters[wallet_address][$eq]=${address}`,
      fetcherStrapi
    );

  const { data: referralTradersData, mutate: mutateReferralTraders } = useSWR(
    `/api/wallets-referreds?filters[wallet_address][$eq]=${address}&populate=*`,
    fetcherStrapi
  );

  const referralAffiliatesResult = referralAffiliatesData?.data?.data;
  const referralTradersResult = referralTradersData?.data?.data;
  const walletPersonalData = personalData?.data?.data;
  console.log(walletPersonalData);
  let periodCheckBank = 0;

  const checkBankInquiry: any = async () => {
    const getBankAccount = await axiosSecondary.post("/inquiry", {
      account_number: bankAccountValue,
      bank_code: currentSelectedBank.bank_code.toLowerCase(),
    });
    if (getBankAccount.data.status !== "PENDING") {
      return getBankAccount;
    }
    if (periodCheckBank >= 20000) {
      return {
        data: {
          status: "TIME_OUT",
          account_holder: "",
        },
      };
    }
    await delay(2500);
    periodCheckBank += 2500;
    return checkBankInquiry();
  };

  const [userData, setUserData] = useState({
    displayName: "",
    username: "",
    email: "",
    defaultDestination: "",
  });

  const { data: historyData, mutate: mutateHistoryData } = useSWR(
    `/api/wallet-accounts?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );

  const addToWalletAccounts = async () => {
    axiosApi
      .post("/api/check-wallet-accounts", {
        wallet_address: address,
        bank_code: currentSelectedBank.bank_code,
        bank_account_name: bankAccountName,
        bank_account_number: bankAccountValue,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (historyData?.data.data) {
      const temp = [];
      const theHistoryData = historyData?.data?.data;
      for (let currentData of theHistoryData) {
        temp.push({
          id: currentData.id,
          bank_account_name: currentData.attributes.bank_account_name,
          bank_code: currentData.attributes.bank_code,
          bank_account_number: currentData.attributes.bank_account_number,
        });
      }
      setUserWalletData([...temp]);
    }
  }, [historyData]);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  useEffect(() => {
    if (walletPersonalData && walletPersonalData.length > 0) {
      setUserData({
        displayName: walletPersonalData[0].attributes.display_name,
        username: walletPersonalData[0].attributes.username,
        email: walletPersonalData[0].attributes.email,
        defaultDestination:
          walletPersonalData[0].attributes.default_destination,
      });
      setCurrentSecondaryBank({
        imgUrl: walletPersonalData[0].attributes.default_bank_img_url,
        name: walletPersonalData[0].attributes.default_destination,
        bank_code: walletPersonalData[0].attributes.default_bank_code,
      });
    } else {
      setUserData({
        displayName: "",
        username: "",
        email: "",
        defaultDestination: "",
      });
    }
  }, [walletPersonalData, address]);

  return (
    <MainLayout>
      <div className="px-[50px] py-[25px]" ref={scrollToTop}>
        <p className="text-[32px] font-bold text-white">Profile Account</p>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] flex items-center justify-between md:flex-row flex-col gap-y-4">
          <Image src="/img/person.svg" width={124} height={124} alt="person" />
          {walletPersonalData?.[0]?.attributes?.username ? (
            <QRCode
              value={`https://app.seamless.finance/p/${userData?.username}`}
              size={124}
            />
          ) : (
            <p className="text-center">
              Please fill your personal information to generate your own QR
              code.
            </p>
          )}
          {/* <Image
            src="/img/qr_code.svg"
            width={124}
            height={124}
            alt="qr_code"
          /> */}
        </div>
        <div>
          {walletPersonalData &&
          walletPersonalData.length > 0 &&
          walletPersonalData[0].attributes.id_number ? (
            <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
              <p className="text-[14px] text-white">
                You have applied for KYC. Please wait until your application is
                approved!
              </p>
            </div>
          ) : (
            <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
              <p className="text-[#EB5757] font-bold text-[24px]">
                Complete Your Account Verification!
              </p>
              <p className="text-[14px] mt-[15px] text-white">
                Enhance your account security and access. Verify your account
                now for seamless access.{" "}
                <a
                  onClick={() => {
                    router.push("/verify");
                  }}
                  className="cursor-pointer text-[#2F80ED] underline"
                >
                  Verify your account here.
                </a>
              </p>
            </div>
          )}
        </div>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
          <p className="text-white font-bold text-[24px]">
            Personal Information
          </p>
          <div className="mt-4 text-white">
            <p>Display Name</p>
            <input
              value={userData.displayName}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  displayName: e.target.value,
                }))
              }
              type="text"
              placeholder="Muhammad Rudi"
              className="flex-1 h-[50px] text-[13px] md:text-[16px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
          </div>
          <div className="mt-4 flex gap-x-4 w-full">
            <div className="flex-1">
              <p className="text-white">Username</p>
              <input
                value={userData.username}
                onChange={(e) =>
                  setUserData((prevState) => ({
                    ...prevState,
                    username: e.target.value,
                  }))
                }
                type="text"
                placeholder="rudirm"
                className="flex-1 text-[13px] md:text-[16px] mt-[10px] h-[50px] bg-[#333333] border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-white">Email</p>
              <input
                value={userData.email}
                onChange={(e) =>
                  setUserData((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
                type="email"
                placeholder="rudi@gmail.com"
                className="flex-1 text-[13px] md:text-[16px] mt-[10px] h-[50px] bg-[#333333] border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
          </div>
          <p className="mt-4 text-white">Default Destination</p>
          <div className="flex gap-x-2 h-[50px] bg-[#333333] items-center mt-[15px]">
            <div
              onClick={() => {
                setIsSecondaryBank(true);
                setBankModal(true);
              }}
              className="relative cursor-pointer h-full w-full"
            >
              <Image
                src="/img/arrow-down.svg"
                width={18}
                height={17}
                alt="arrow"
                className="absolute right-2 bottom-[15px]"
              />
              <div className="flex-1 gap-x-2 text-[13px] md:text-[16px] h-full items-center flex bg-transparent border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                {currentSecondaryBank?.imgUrl && (
                  <Image
                    src={currentSecondaryBank?.imgUrl ?? ""}
                    width={30}
                    height={30}
                    alt="walao"
                  />
                )}
                <p>
                  {!currentSecondaryBank?.name
                    ? "Select Destination"
                    : currentSecondaryBank?.name}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              disabled={personalInformationLoading}
              onClick={async () => {
                if (
                  !currentSecondaryBank?.name ||
                  !userData.displayName ||
                  !userData.email ||
                  !userData.username
                ) {
                  return Swal.fire(
                    "Info!",
                    "Please fill all the data!",
                    "info"
                  );
                }
                if (!validateEmail(userData.email)) {
                  return Swal.fire("Info!", "Email format incorrect!", "info");
                }
                setPersonalInformationLoading(true);
                if (walletPersonalData && walletPersonalData.length > 0) {
                  await axiosApi.put(
                    `/api/user-wallets/${walletPersonalData[0].id}`,
                    {
                      data: {
                        display_name: userData.displayName,
                        username: userData.username,
                        email: userData.email,
                        default_destination: currentSecondaryBank?.name,
                        default_bank_code: currentSecondaryBank?.bank_code,
                        default_bank_img_url: currentSecondaryBank?.imgUrl,
                      },
                    }
                  );
                } else {
                  await axiosApi.post("/api/user-wallets", {
                    data: {
                      wallet_address: address,
                      display_name: userData.displayName,
                      username: userData.username,
                      email: userData.email,
                      default_destination: currentSecondaryBank?.name,
                      default_bank_code: currentSecondaryBank?.bank_code,
                      default_bank_img_url: currentSecondaryBank?.imgUrl,
                    },
                  });
                }
                mutatePersonalData();
                Swal.fire(
                  "Success!",
                  "Successfully changes your personal data!",
                  "success"
                );
                setPersonalInformationLoading(false);
              }}
              className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[20px]"
            >
              {personalInformationLoading ? (
                <ColorRing
                  visible={true}
                  height="24"
                  width="24"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : (
                <div className="flex gap-x-2">
                  <Image
                    src="/img/edit.svg"
                    width={24}
                    height={24}
                    alt="edit"
                  />
                  <span className="text-white">
                    {walletPersonalData && walletPersonalData.length > 0
                      ? "Edit"
                      : "Add"}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="bg-[#21222D]  rounded-[12px] mt-[35px]">
          <div className="p-[20px]">
            <p className="text-white font-bold text-[24px]">Destination List</p>
          </div>
          <Table
            pagination={false}
            dataSource={userWalletData}
            columns={columns}
            rowClassName="bg-[#21222D] text-white border hover:text-black"
          />
          <div className="flex flex-col md:flex-row gap-4 md:gap-2 p-[10px] border-b items-center mb-[10px]">
            <div
              onClick={() => {
                setIsSecondaryBank(false);
                setBankModal(true);
                setBankAccountName("");
              }}
              className="relative cursor-pointer w-full md:w-[160px] lg:w-[260px]"
            >
              <Image
                src="/img/arrow-down.svg"
                width={18}
                height={17}
                alt="arrow"
                className="absolute right-2 bottom-[8px]"
              />
              <div className="h-[36px] w-full md:flex-1 items-center flex md:h-[36px] bg-transparent border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                <p>
                  {!currentSelectedBank?.name
                    ? "Select Destination"
                    : currentSelectedBank?.name}
                </p>
              </div>
            </div>
            <input
              onChange={(e) => {
                setBankAccountValue(e.target.value);
                setBankAccountName("");
              }}
              value={bankAccountValue}
              placeholder="Enter Account Number"
              className="md:flex-1 h-[36px] border rounded-[8px] px-[10px] text-cute text-socket-primary bg-transparent focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
            <input
              value={bankAccountName}
              disabled
              placeholder="Account Name"
              className="md:flex-1 h-[36px] border rounded-[8px] px-[10px] text-cute text-socket-primary bg-transparent focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
            <button
              disabled={isCheckingBankAccount}
              onClick={async () => {
                try {
                  setIsCheckingBankAccount(true);
                  periodCheckBank = 0;
                  const getBankAccount = await checkBankInquiry();
                  setIsCheckingBankAccount(false);
                  if (getBankAccount?.data.status === "TIME_OUT") {
                    return Swal.fire(
                      "Time Out",
                      "Please try again a bit later.",
                      "info"
                    );
                  }
                  setBankAccountName(getBankAccount?.data.account_holder);
                  if (
                    getBankAccount?.data.status === "INVALID_ACCOUNT_NUMBER"
                  ) {
                    return Swal.fire(
                      "Error!",
                      "Bank account number invalid!",
                      "error"
                    );
                  }
                } catch (e) {
                  setIsCheckingBankAccount(false);
                  Swal.fire("Error!", "Bank account number invalid!", "error");
                  console.log(e, "<<< E!");
                }
              }}
              className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[8px] px-[12px] items-center"
            >
              {isCheckingBankAccount ? (
                <ColorRing
                  visible={true}
                  height="24"
                  width="24"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : (
                <span className="text-white">Check</span>
              )}
            </button>
          </div>
          <div className="mt-4 flex justify-end mr-[20px] pb-[20px]">
            <button
              disabled={saveLoading}
              onClick={async () => {
                if (!bankAccountName)
                  return Swal.fire(
                    "Info!",
                    "Please fill all the data and click check!",
                    "info"
                  );
                for (let theData of historyData?.data?.data) {
                  if (
                    theData.attributes.bank_account_number.toLowerCase() ===
                    bankAccountValue.toLowerCase()
                  ) {
                    return Swal.fire(
                      "Info!",
                      "Account already exists!",
                      "info"
                    );
                  }
                }

                setSaveLoading(true);
                axiosApi
                  .post("/api/check-wallet-accounts", {
                    wallet_address: address,
                    bank_code: currentSelectedBank.bank_code,
                    bank_account_name: bankAccountName,
                    bank_account_number: bankAccountValue,
                  })
                  .then(async (res) => {
                    await mutateHistoryData();
                    setCurrentSelectedBank({
                      name: "",
                      bank_code: "",
                      imgUrl: "",
                    });
                    setBankAccountName("");
                    setBankAccountValue("");
                    setSaveLoading(false);
                    Swal.fire(
                      "Success!",
                      "Successfully added destination data!",
                      "success"
                    );
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
              className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[20px] h-full"
            >
              <Image src="/img/edit.svg" width={24} height={24} alt="edit" />
              <span>
                {saveLoading ? (
                  <ColorRing
                    visible={true}
                    height="24"
                    width="24"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  <span className="text-white">Save</span>
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
          <p className="text-white font-bold text-[24px]">Referrals</p>
          <p className="text-[16px] mt-[10px] w-full md:w-4/5 text-[#CCCCCC]">
            Earn Seamless Points via our referral program. Seamless Points can
            be redeemed to perks later on. Find complete program details{" "}
            <a className="cursor-pointer text-blue underline">HERE</a>&nbsp; for
            more information.
          </p>
          <div className="flex gap-x-2 rounded-full p-1 bg-[#4D4D4D] w-fit mx-auto mt-5">
            <div
              onClick={() => setReferralTab("traders")}
              className={`cursor-pointer px-8 py-2 ${
                referralTab === "traders" && "bg-btn"
              } rounded-full`}
            >
              Traders
            </div>
            <div
              onClick={() => setReferralTab("affiliates")}
              className={`cursor-pointer px-8 py-2 ${
                referralTab === "affiliates" && "bg-btn"
              } rounded-full`}
            >
              Affiliates
            </div>
          </div>
          {referralTab === "traders" && (
            <div>
              {referralTradersResult && referralTradersResult?.length === 0 ? (
                <div>
                  <p className="my-[20px] text-[#CCCCCC] text-center">
                    Kindly provide a referral code for discounted fees
                  </p>
                  <div className="mt-4 text-white">
                    <p className="text-[#CCCCCC]">Enter Referral Code</p>
                    <input
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Eg. ytdb5"
                      className="flex-1 h-[50px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                    />
                  </div>
                  <div className="mt-4 flex justify-end mr-[20px] w-full">
                    <button
                      onClick={async () => {
                        if (referralCode.length === 0) {
                          return Swal.fire(
                            "Info!",
                            "Please fill referral code field!",
                            "info"
                          );
                        }
                        try {
                          setReferralCodeLoading(true);
                          const res = await axiosApi.get(
                            `/api/referral-codes?filters[code][$eq]=${referralCode}`
                          );
                          const result = res?.data?.data;
                          if (result.length === 0) {
                            setReferralCodeLoading(false);
                            return Swal.fire(
                              "Info!",
                              "Referral code does not exist!",
                              "info"
                            );
                          } else {
                            if (
                              referralAffiliatesResult &&
                              referralAffiliatesResult.length > 0
                            ) {
                              if (
                                referralAffiliatesResult[0].attributes.code ===
                                referralCode
                              ) {
                                setReferralCodeLoading(false);
                                return Swal.fire(
                                  "Info!",
                                  "Cannot register to your own referral code!",
                                  "info"
                                );
                              }
                            }
                            const postData = await axiosApi.post(
                              `/api/wallets-referreds`,
                              {
                                data: {
                                  wallet_address: address,
                                  referral_code: result[0].id,
                                },
                              }
                            );
                            Swal.fire(
                              "Success!",
                              "Successfully added your personal referral code!",
                              "success"
                            );
                          }
                          mutateReferralTraders();
                          setReferralCode("");
                        } catch (e) {
                          console.log(e);
                        }
                        setReferralCodeLoading(false);
                      }}
                      className="flex gap-x-2 text-white linear-gradient-2 justify-center bg-btn rounded-[12px] py-[12px] px-[20px] w-full"
                    >
                      {referralCodeLoading ? (
                        <ColorRing
                          visible={true}
                          height="24"
                          width="24"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                          colors={[
                            "#e15b64",
                            "#f47e60",
                            "#f8b26a",
                            "#abbd81",
                            "#849b87",
                          ]}
                        />
                      ) : (
                        "Submit Referral Code"
                      )}
                    </button>
                  </div>
                </div>
              ) : referralAffiliatesResult &&
                referralTradersResult?.length > 0 ? (
                <div className="flex justify-center items-center my-[20px]">
                  <p className="text-cute">
                    You have registered to a referral code:&nbsp;
                    <span className="underline text-white">
                      {
                        referralTradersResult?.[0].attributes.referral_code.data
                          .attributes.code
                      }
                    </span>
                  </p>
                </div>
              ) : (
                <ColorRing
                  visible={true}
                  height="24"
                  width="24"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              )}
            </div>
          )}
          {referralTab === "affiliates" && (
            <div>
              {referralAffiliatesResult &&
              referralAffiliatesResult.length === 0 ? (
                <div>
                  <p className="my-[20px] text-[#CCCCCC] text-center">
                    Looks like you don&apos;t have a referral code to share.
                    Create one now and start earning rebates!
                  </p>
                  <div className="mt-4 text-white">
                    <p className="text-[#CCCCCC]">Generate Referral Code</p>
                    <input
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Eg. ytdb5"
                      className="flex-1 h-[50px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-white text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                    />
                  </div>
                  <div className="mt-4 flex justify-end mr-[20px] w-full">
                    <button
                      onClick={async () => {
                        if (referralCode.length === 0) {
                          return Swal.fire(
                            "Info!",
                            "Please fill referral code field!",
                            "info"
                          );
                        }
                        try {
                          setReferralCodeLoading(true);
                          const getRes = await axiosApi.get(
                            `/api/referral-codes?filters[code][$eq]=${referralCode}`
                          );
                          const getResult = getRes?.data?.data;
                          if (getResult.length > 0) {
                            setReferralCodeLoading(false);
                            return Swal.fire(
                              "Info!",
                              "Referral code already exists!",
                              "info"
                            );
                          }
                          const res = await axiosApi.post(
                            "/api/referral-codes",
                            {
                              data: {
                                code: referralCode,
                                wallet_address: address,
                              },
                            }
                          );
                          Swal.fire(
                            "Success!",
                            "Successfully added your personal referral code!",
                            "success"
                          );
                          mutateReferralAffiliates();
                          setReferralCode("");
                        } catch (e) {
                          setReferralCodeLoading(false);
                          console.log(e);
                        }
                        setReferralCodeLoading(false);
                      }}
                      className="flex gap-x-2 text-white linear-gradient-2 justify-center bg-btn rounded-[12px] py-[12px] px-[20px] w-full"
                    >
                      {referralCodeLoading ? (
                        <ColorRing
                          visible={true}
                          height="24"
                          width="24"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                          colors={[
                            "#e15b64",
                            "#f47e60",
                            "#f8b26a",
                            "#abbd81",
                            "#849b87",
                          ]}
                        />
                      ) : (
                        "Submit Referral Code"
                      )}
                    </button>
                  </div>
                </div>
              ) : referralAffiliatesResult &&
                referralAffiliatesResult.length > 0 ? (
                <div className="flex justify-center items-center my-[20px]">
                  <p className="text-cute">
                    Here is your referral generated code:{" "}
                    <span className="underline text-white">
                      {referralAffiliatesResult[0].attributes.code}
                    </span>
                  </p>
                </div>
              ) : (
                <ColorRing
                  visible={true}
                  height="24"
                  width="24"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <BankModal
        bankModal={bankModal}
        setBankModal={setBankModal}
        banksList={banksData}
        setCurrentSelectedBank={setCurrentSelectedBank}
        currentSelectedBank={currentSelectedBank}
        hideDonation
        currentSecondaryBank={currentSecondaryBank}
        setCurrentSecondaryBank={setCurrentSecondaryBank}
        isSecondaryBank={isSecondaryBank}
      />
    </MainLayout>
  );
}
