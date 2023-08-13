"use client";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useState } from "react";
import {
  useEtherBalance,
  useEthers,
  useTokenBalance,
  useSendTransaction,
} from "@usedapp/core";
import useSWR from "swr";
import { axiosStrapi, fetcher } from "@/utils/axios";
import { useEffect } from "react";
import { formatEther, formatUnits } from "@ethersproject/units";
import { bankData, chainData } from "@/utils/helper";
import { MainLayout } from "@/layouts/Main";
import { utils } from "ethers";
import { Bars } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  const depositAddress = process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS;
  const { account, deactivate, activateBrowserWallet, chainId } = useEthers();
  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const [cryptoValue, setCryptoValue] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [idrValue, setIdrValue] = useState("");
  const [tokenModal, setTokenModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [bankAccountValue, setBankAccountValue] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionData, setTransactionData] = useState<any>();
  const [currentSelectedBank, setCurrentSelectedBank] = useState({
    id: 1,
    name: "BCA",
    imgUrl: "/img/bca.png",
  });
  const [transactionLoading, setTransactionLoading] = useState(false);

  const currentChain = chainData.find((data) => data.chainId === chainId);
  const [currentSelectedToken, setCurrentSelectedToken] = useState(
    currentChain?.tokenData.find((data) => data.name === "USDC")
  );
  const resetAllFields = () => {
    setCryptoValue("");
    setPreviousValue("");
    setBankAccountName("");
    setBankAccountValue("");
    setPhoneNumber("");
  };
  const { data } = useSWR(
    `/markets?vs_currency=idr&ids=${currentSelectedToken?.coingecko ?? ""}`,
    fetcher
  );
  const nativeBalance = useEtherBalance(account);
  const tokenBalance = useTokenBalance(
    currentSelectedToken?.contractAddress,
    account
  );
  const usedBalance = currentSelectedToken?.native
    ? parseFloat(
        formatUnits(
          nativeBalance ?? "0x00",
          currentSelectedToken?.decimals
        ).slice(0, 8)
      )
    : parseFloat(
        formatUnits(
          tokenBalance ?? "0x00",
          currentSelectedToken?.decimals
        ).slice(0, 8)
      );
  const insufficientBalance = parseFloat(cryptoValue ?? "0") > usedBalance;

  useEffect(() => {
    if (data) {
      const previousValue1 = previousValue.slice(0, previousValue.length - 1);
      const previousValue2 = previousValue;
      const usedValue =
        previousValue2 >= previousValue1 ? previousValue1 : previousValue2;
      const thisValue = !cryptoValue ? usedValue : cryptoValue;
      const idr = (
        data.data[0].current_price * parseFloat(thisValue ?? "0")
      ).toLocaleString("en-US");
      setIdrValue(idr === "NaN" ? "0" : idr);
      setPreviousValue(cryptoValue);
    }
  }, [data, cryptoValue]);

  useEffect(() => {
    setCurrentSelectedToken(
      currentChain?.tokenData.find((data) => data.name === "USDC")
    );
  }, [chainId]);

  useEffect(() => {
    console.log(state, "<<< state");
    if (state.status.toLowerCase() === "mining" && !transactionLoading) {
      setTransactionLoading(true);
      axiosStrapi
        .post("/api/transaction-histories", {
          data: {
            wallet_address: account,
            token: currentSelectedToken?.name,
            chain: chainId?.toString(),
            bank_name: currentSelectedBank.name,
            bank_account_number: bankAccountValue,
            status: "Waiting",
            bank_account_name: bankAccountName,
            phone_number: phoneNumber,
            token_value: cryptoValue,
            idr_value: idrValue,
            transaction_success: false,
            wallet_destination: depositAddress,
          },
        })
        .then((res) => {
          setTransactionData(res.data);
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (state.status.toLowerCase() === "success") {
      axiosStrapi
        .put(`/api/transaction-histories/${transactionData?.data.id ?? ""}`, {
          data: {
            transaction_hash: state.receipt?.transactionHash,
            gas_price: formatEther(state.receipt?.effectiveGasPrice ?? "0x0"),
            transaction_success: true,
          },
        })
        .then((res) => {
          console.log(res, "???");
        })
        .catch((e) => {
          console.log(e, "<<< E");
        });
      resetAllFields();
      setTransactionData(null);
      setTransactionLoading(false);
      Swal.fire(
        "Success!",
        "Transaction successful! Please wait for our admin to contact you.",
        "success"
      );
    }
    if (
      state.status.toLowerCase() === "none" ||
      state.status.toLowerCase() === "success" ||
      state.status.toLowerCase() === "exception"
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [state]);

  return (
    <MainLayout>
      <div className="pt-[15vh]">
        <div className="min-h-[80vh] w-full flex justify-center items-center">
          <div className="primary-container rounded-xl p-6 sm:w-[520px] sm:min-w-[520px]">
            <p className="font-bold text-xl">Transfer</p>
            <div
              className={`rounded-t p-2 from-container mt-2 flex justify-between  ${
                insufficientBalance
                  ? "border-l border-t border-r border-red"
                  : "border-l border-t border-r border-primaryGray"
              }`}
            >
              <div className="flex">
                <p className="text-gray">From</p>
                <button className="skt-w skt-w-input skt-w-button flex items-center p-2 flex-shrink-0 w-auto py-0 hover:bg-transparent bg-transparent justify-start sm:justify-between cursor-default">
                  <span className="flex items-center">
                    <div className="relative flex h-fit w-fit">
                      <div className="skt-w rounded-full overflow-hidden w-5 h-5 sm:w-6 sm:h-6">
                        <img
                          src={currentChain?.imgUrl ?? "/img/Ether.svg"}
                          width="100%"
                          height="100%"
                        />
                      </div>
                      {currentChain ? (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]"></span>
                        </span>
                      ) : null}
                    </div>
                    <span className="skt-w ml-1 -mb-0.5 font-medium text-socket-primary sm:text-lg">
                      {currentChain?.name ?? "Ethereum"}
                    </span>
                  </span>
                </button>
              </div>
              <p className="text-gray">
                Bal: {`${usedBalance} ${currentSelectedToken?.name}`}
              </p>
            </div>
            <div
              className={`rounded-b to-container flex items-center justify-between px-3 py-[14px] sm:py-4 ${
                parseFloat(cryptoValue ?? "0") > usedBalance
                  ? "border-l border-r border-b border-red"
                  : "border-l border-r border-b border-primaryGray"
              }`}
            >
              <div className="relative flex w-full items-center overflow-hidden">
                <input
                  onKeyDown={(evt) => {
                    ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault();
                  }}
                  value={cryptoValue}
                  onChange={(e) => {
                    e.preventDefault();
                    const re = /^[0-9]*[.,]?[0-9]*$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === "" || re.test(e.target.value)) {
                      setCryptoValue(e.target.value.replaceAll(",", "."));
                    }
                  }}
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                  placeholder="0.0"
                  spellCheck={false}
                  type="text"
                />
                <div className="invisible absolute w-fit text-xl font-bold"></div>
              </div>
              <span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTokenModal(true);
                  }}
                  className="skt-w skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent"
                >
                  <span className="flex items-center">
                    <div className="relative flex h-fit w-fit">
                      <div className="skt-w h-6 w-6 rounded-full overflow-hidden">
                        <img
                          src={currentSelectedToken?.imgUrl ?? ""}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    </div>
                    <span className="z-50 cursor-pointer skt-w ml-1 font-medium text-socket-primary sm:text-lg mx-1 flex justify-center items-center gap-x-1">
                      {currentSelectedToken?.name ?? ""}
                      <AiOutlineArrowDown />
                    </span>
                  </span>
                </button>
              </span>
            </div>
            <a className="relative mx-auto -mt-2.5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 disabled:opacity-60 middle-btn">
              <AiOutlineArrowDown />
            </a>
            <div className="rounded-t p-2 from-container -mt-2.5 flex gap-x-1 items-center">
              <p className="text-gray">To:</p>
              <div
                onClick={(e) => {
                  setBankModal(true);
                }}
                className="cursor-pointer flex gap-x-1 items-center"
              >
                <div className="skt-w flex items-center bg-white rounded-full overflow-hidden w-5 h-5 sm:w-6 sm:h-6">
                  <img
                    src={currentSelectedBank.imgUrl}
                    width="100%"
                    height="100%"
                  />
                </div>
                <p>{currentSelectedBank.name}</p>
                <AiOutlineArrowDown />
              </div>
            </div>
            <div className="px-3 py-[14px] to-container border-l border-r border-b border-gray">
              <input
                onKeyDown={(evt) => {
                  ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault();
                }}
                value={phoneNumber}
                onChange={(e) => {
                  e.preventDefault();
                  const re = /^[0-9]*[.,]?[0-9]*$/;

                  // if value is not blank, then test the regex

                  if (e.target.value === "" || re.test(e.target.value)) {
                    let temp = e.target.value.replaceAll(",", "");
                    let lastTemp = temp.replaceAll(".", "");
                    setPhoneNumber(lastTemp);
                  }
                }}
                className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="Phone Number (WhatsApp)"
                spellCheck={false}
                type="text"
              />
            </div>
            <div className="px-3 py-[14px] to-container border-l border-r border-b border-gray">
              <input
                value={bankAccountName}
                onChange={(e) => {
                  setBankAccountName(e.target.value);
                }}
                className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="Account Name"
                spellCheck={false}
                type="text"
              />
            </div>
            <div className="px-3 py-[14px] to-container border-l border-r border-b border-gray">
              <input
                onKeyDown={(evt) => {
                  ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault();
                }}
                value={bankAccountValue}
                onChange={(e) => {
                  e.preventDefault();
                  const re = /^[0-9]*[.,]?[0-9]*$/;

                  // if value is not blank, then test the regex

                  if (e.target.value === "" || re.test(e.target.value)) {
                    let temp = e.target.value.replaceAll(",", "");
                    let lastTemp = temp.replaceAll(".", "");
                    setBankAccountValue(lastTemp);
                  }
                }}
                className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="Account Number"
                spellCheck={false}
                type="text"
              />
            </div>
            <div className="rounded-b to-container px-3 py-[14px] flex justify-between items-center">
              <input
                value={idrValue}
                onChange={(e) => {
                  e.preventDefault();
                }}
                className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="0.0"
                spellCheck={false}
                type="text"
                disabled
              />
              <span>
                <button className="skt-w skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent cursor-default">
                  <span className="flex items-center relative h-fit w-fit mr-2">
                    <img
                      className="skt-w mr-1 h-6 w-6 rounded-full"
                      src="img/indo2.png"
                      width="100%"
                      height="100%"
                    />
                    <span className="skt-w ml-1 font-medium text-socket-primary sm:text-lg mx-1">
                      IDR
                    </span>
                  </span>
                </button>
              </span>
            </div>
            <button
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  if (!account) {
                    activateBrowserWallet();
                    return;
                  }
                  if (insufficientBalance) return;
                  if (
                    !cryptoValue ||
                    !phoneNumber ||
                    !bankAccountName ||
                    !bankAccountValue ||
                    cryptoValue === "."
                  ) {
                    Swal.fire(
                      "Not done!",
                      "Please fill all the necessary fields",
                      "warning"
                    );
                    return;
                  }
                  const tx = await sendTransaction({
                    to: depositAddress,
                    value: utils.parseUnits(
                      cryptoValue,
                      currentSelectedToken?.decimals
                    ),
                  });
                  console.log(tx, "<<< tx");
                } catch (e) {
                  console.log(e);
                  setLoading(false);
                }
              }}
              className={`mt-5 rounded font-bold ${
                loading
                  ? "bg-darkGray cursor-not-allowed"
                  : !account
                  ? "bg-purple"
                  : insufficientBalance
                  ? "bg-red/30 cursor-not-allowed"
                  : "bg-purple"
              } w-full leading-[24px] px-4 py-[13px] flex items-center justify-center`}
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
              ) : !account ? (
                "Connect Wallet"
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : (
                "Transfer to Bank"
              )}
            </button>
          </div>
        </div>
        <div className={`${tokenModal ? "block" : "hidden"}`}>
          <div
            className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm h-full w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex"
            style={{ opacity: 1 }}
          >
            <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] rounded-b-none sm:rounded-b-xl absolute sm:static bottom-0 w-full h-fit">
              <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
                <h3 className="text-lg font-medium text-socket-primary">
                  Select Token
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setTokenModal(false);
                    }}
                    className="flex h-9 w-9 transition duration-400 items-center justify-center rounded-full bg-mainGray2 hover:bg-layer3 sm:h-10 sm:w-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 cursor-pointer text-socket-primary"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex h-fit flex-col">
                  <div className="relative border-gray p-4">
                    <div>
                      <div className="noScrollbar -mx-2 flex overflow-x-auto sm:flex-wrap">
                        {currentChain?.tokenData &&
                          currentChain?.tokenData.map((token, idx) => (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentSelectedToken({
                                  ...token,
                                });
                                setTokenModal(false);
                              }}
                              key={token.id}
                              className={`m-1 transition duration-400 flex min-w-fit items-center rounded-full border py-1 pl-1.5 pr-2  disabled:opacity-40 disabled:hover:bg-transparent sm:px-2 border border-gray ${
                                currentSelectedToken?.id === token.id
                                  ? "bg-layer3 hover:border-layer3"
                                  : "hover:border-transparent hover:bg-mainGray2"
                              }`}
                            >
                              <div className="skt-w rounded-full overflow-hidden h-6 w-6 mr-1.5">
                                <img
                                  src={token.imgUrl}
                                  width="100%"
                                  height="100%"
                                />
                              </div>
                              <span className="pt-px font-medium uppercase text-socket-primary sm:text-lg">
                                {token.name}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${bankModal ? "block" : "hidden"}`}>
          <div
            className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm h-full w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex"
            style={{ opacity: 1 }}
          >
            <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] rounded-b-none sm:rounded-b-xl absolute sm:static bottom-0 w-full h-fit">
              <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
                <h3 className="text-lg font-medium text-socket-primary">
                  Select Bank
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setBankModal(false);
                    }}
                    className="flex h-9 w-9 transition duration-400 items-center justify-center rounded-full bg-mainGray2 hover:bg-layer3 sm:h-10 sm:w-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 cursor-pointer text-socket-primary"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex h-fit flex-col justify-center">
                  <div className="relative border-gray p-4">
                    <div>
                      <div className="noScrollbar -mx-2 flex overflow-x-auto sm:flex-wrap items-center">
                        {bankData.map((bank, idx) => (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentSelectedBank({ ...bank });
                              setBankModal(false);
                            }}
                            key={bank.id}
                            className={`m-1 transition duration-400 flex min-w-fit items-center rounded-full border py-1 pl-1.5 pr-2  disabled:opacity-40 disabled:hover:bg-transparent sm:px-2 border border-gray ${
                              currentSelectedBank?.id === bank.id
                                ? "bg-layer3 hover:border-layer3"
                                : "hover:border-transparent hover:bg-mainGray2"
                            }`}
                          >
                            <img
                              className="skt-w bg-white rounded-full overflow-hidden h-6 w-6 mr-1.5"
                              src={bank.imgUrl}
                              width="100%"
                              height="100%"
                            />
                            <span className="pt-px font-medium uppercase text-socket-primary sm:text-lg">
                              {bank.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
