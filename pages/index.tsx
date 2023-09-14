"use client";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useState } from "react";
import {
  useEtherBalance,
  useEthers,
  useTokenBalance,
  useSendTransaction,
  useContractFunction,
  useSigner,
} from "@usedapp/core";
import useSWR from "swr";
import {
  axiosFlip,
  axiosStrapi,
  fetcher,
  fetcherFlip,
  fetcherStrapi,
} from "@/utils/axios";
import erc20Abi from "../contracts/erc20-abi.json";
import seamlessAbi from "../contracts/seamless4-abi.json";
import { useEffect } from "react";
import { formatEther, formatUnits } from "@ethersproject/units";
import { bankData, chainData } from "@/utils/helper";
import { MainLayout } from "@/src/layouts/Main";
import { Contract, utils } from "ethers";
import { Bars, ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import { CustomModal } from "@/src/components/CustomModal";
import { BankModal } from "@/src/components/BankModal";
import { JsonFormatter } from "@/utils/crypto";
import { useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { HistoryModal } from "@/src/components/HistoryModal";
import { io } from "socket.io-client";

const customContract = process.env.NEXT_PUBLIC_CUSTOM_CONTRACT;

export default function HomePage() {
  const [alreadySigned, setAlreadySigned] = useState(false);
  const theme = useSelector((state: RootState) => state.theme);
  const erc20Interface = new utils.Interface(erc20Abi);
  const seamlessInterface = new utils.Interface(seamlessAbi);
  const router = useRouter();
  const depositAddress = process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS;
  const signer = useSigner();
  const socket = io("https://invoker.cloud");
  const { account, deactivate, activateBrowserWallet, chainId } = useEthers();
  const [loading, setLoading] = useState(false);
  const [cryptoValue, setCryptoValue] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [idrValue, setIdrValue] = useState("");
  const [tokenModal, setTokenModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [bankAccountValue, setBankAccountValue] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionData, setTransactionData] = useState<any>();
  const [isCheckingBankAccount, setIsCheckingBankAccount] = useState(false);
  const [currentSelectedBank, setCurrentSelectedBank] = useState({
    name: "BCA",
    bank_code: "bca",
    imgUrl: "/img/banks/bca.png",
  });
  const [transactionLoading, setTransactionLoading] = useState(false);

  const currentChain = chainData.find((data) => data.chainId === chainId);
  const [currentSelectedToken, setCurrentSelectedToken] = useState(
    currentChain?.tokenData.find((data) => data.name === "USDC")
  );
  const erc20Contract = new Contract(
    currentSelectedToken?.contractAddress ??
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    erc20Interface
  );
  const seamlessContract = new Contract(
    customContract ?? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    seamlessInterface
  );

  const { send: approveErc20Send, state: approveErc20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve ERC20 transfer",
    });

  const { send: transferSeamless, state: seamlessState } = useContractFunction(
    seamlessContract,
    "sendToken",
    {
      transactionName: "Send Token",
    }
  );

  const { send: nativeTransferSeamless, state: nativeSeamlessState } =
    useContractFunction(seamlessContract, "sendNativeToken", {
      transactionName: "Send Native Token",
    });

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
  const { data: banksData } = useSWR(`/banks`, fetcherFlip);
  const { data: historyData } = useSWR(
    `/api/wallet-accounts?filters[wallet_address][$eq]=${account}&filters[bank_code][$eq]=${currentSelectedBank.bank_code}`,
    fetcherStrapi
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

  const addToWalletAccounts = () => {
    axiosStrapi
      .get("/api/wallet-accounts")
      .then((res) => {
        const result = res.data.data;
        let found = false;
        for (let walletData of result) {
          if (
            walletData.attributes.wallet_address.toLowerCase() ===
              account?.toLowerCase() &&
            walletData.attributes.bank_code === currentSelectedBank.bank_code &&
            walletData.attributes.bank_account_name === bankAccountName &&
            walletData.attributes.bank_account_number === bankAccountValue
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          axiosStrapi
            .post("/api/wallet-accounts", {
              data: {
                wallet_address: account,
                bank_code: currentSelectedBank.bank_code,
                bank_account_name: bankAccountName,
                bank_account_number: bankAccountValue,
                phone_number: phoneNumber,
              },
            })
            .then((res) => {
              console.log(res.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addToTransactionHistory = () => {
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
          idempotency_key: "",
          transaction_id: "",
        },
      })
      .then((res) => {
        addToWalletAccounts();
        setTransactionData(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateTransactionHistory = (tempState: any) => {
    const idempotencyKey =
      chainData.find((data: any) => data.chainId === tempState.chainId)?.name +
      `-${tempState?.transaction?.hash}`;

    axiosStrapi
      .post("/api/disbursement", {
        idempotency_key: idempotencyKey,
        account_number: bankAccountValue,
        bank_code: currentSelectedBank.bank_code,
        amount: 1000,
      })
      .then(async (res) => {
        const result = res.data;
        await axiosStrapi.put(
          `/api/transaction-histories/${transactionData?.data.id ?? ""}`,
          {
            data: {
              transaction_hash: tempState.receipt?.transactionHash,
              gas_price: formatEther(
                tempState.receipt?.effectiveGasPrice ?? "0x0"
              ),
              transaction_success: true,
              block_confirmation:
                tempState.receipt?.confirmations.toString() ?? "0",
              idempotency_key: idempotencyKey,
              transaction_id: result.id.toString(),
            },
          }
        );
        await axiosStrapi.post("/api/flip-transactions", {
          data: {
            account_number: result.account_number,
            amount: result.amount.toString(),
            account_name: result.recipient_name,
            idempotency_key: result.idempotency_key,
            bank_code: result.bank_code,
            sender_bank: result.sender_bank,
            transaction_id: result.id.toString(),
            fee: result.fee.toString(),
            user_id: result.user_id.toString(),
          },
        });
        resetAllFields();
        setTransactionData(null);
        setTransactionLoading(false);
        Swal.fire(
          "Success!",
          "Transaction successful! Please wait for our admin to contact you.",
          "success"
        );
      });
  };

  useEffect(() => {
    if (
      approveErc20State.status.toLowerCase() === "mining" &&
      !transactionLoading
    ) {
      setTransactionLoading(true);
    }
    if (approveErc20State.status.toLowerCase() === "success") {
      setTransactionLoading(false);
    }
    if (
      approveErc20State.status.toLowerCase() === "none" ||
      approveErc20State.status.toLowerCase() === "success" ||
      approveErc20State.status.toLowerCase() === "exception"
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [approveErc20State]);

  useEffect(() => {
    try {
      const tempState = currentSelectedToken?.native
        ? nativeSeamlessState
        : seamlessState;
      if (tempState.status.toLowerCase() === "mining" && !transactionLoading) {
        setTransactionLoading(true);
        addToTransactionHistory();
      }
      if (tempState.status.toLowerCase() === "success") {
        setTransactionLoading(false);
        updateTransactionHistory(tempState);
      }
      if (
        tempState.status.toLowerCase() === "none" ||
        tempState.status.toLowerCase() === "success" ||
        tempState.status.toLowerCase() === "exception"
      ) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (e) {
      console.log(e, "<<< E!!");
    }
  }, [seamlessState, nativeSeamlessState]);

  useEffect(() => {
    setAlreadySigned(false);
    setBankAccountName("");
    setBankAccountValue("");
  }, [account]);

  useEffect(() => {
    if (historyData && historyData.data.data.length > 0 && !bankAccountName) {
      const lastData = historyData.data.data[historyData.data.data.length - 1];
      setBankAccountName(lastData.attributes.bank_account_name);
      setBankAccountValue(lastData.attributes.bank_account_number);
    }
  }, [historyData]);

  return (
    <MainLayout>
      <div className="the-container relative">
        <div className="min-h-[80vh] w-full flex justify-center items-center">
          <div
            className={`${
              theme.theme === "light"
                ? "primary-container"
                : "primary-container-dark"
            } transition duration-500  rounded-xl p-6 sm:w-[520px] sm:min-w-[520px]`}
          >
            <p className="font-bold text-xl">Transfer</p>
            <div
              className={`rounded-t p-2 ${
                theme.theme === "light"
                  ? "from-container"
                  : "from-container-dark"
              } mt-2 flex justify-between  ${
                insufficientBalance
                  ? "border-l border-t border-r border-red"
                  : "border-l border-t border-r border-transparent"
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
              className={`${
                parseFloat(cryptoValue ?? "0") > usedBalance
                  ? "border-t border-transparent"
                  : "border-t border-transparent"
              }`}
            >
              <div
                className={`rounded-b ${
                  theme.theme === "light" ? "to-container" : "to-container-dark"
                } flex items-center justify-between px-3 py-[14px] sm:py-4 ${
                  parseFloat(cryptoValue ?? "0") > usedBalance
                    ? "border-l border-r border-b border-red"
                    : "border-l border-r border-b border-transparent"
                }`}
              >
                <div className="relative flex w-[35vw] items-center overflow-hidden">
                  <input
                    disabled={loading}
                    onKeyDown={(evt) => {
                      ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault();
                    }}
                    value={cryptoValue}
                    onChange={(e) => {
                      e.preventDefault();
                      const re = /^[0-9]*[.,]?[0-9]*$/;

                      if (e.target.value === "" || re.test(e.target.value)) {
                        setCryptoValue(e.target.value.replaceAll(",", "."));
                      }
                    }}
                    className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                    placeholder="0.0"
                    spellCheck={false}
                    type="number"
                  />
                  <div className="invisible absolute w-fit text-xl font-bold"></div>
                </div>
                <span className="-z-1">
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
                      <span className="cursor-pointer skt-w ml-1 font-medium text-socket-primary sm:text-lg mx-1 flex justify-center items-center gap-x-1">
                        {currentSelectedToken?.name ?? ""}
                        <AiOutlineArrowDown />
                      </span>
                    </span>
                  </button>
                </span>
              </div>
            </div>
            <a className="relative mx-auto -mt-2.5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 disabled:opacity-60 middle-btn text-white">
              <AiOutlineArrowDown />
            </a>
            <div
              className={`rounded-t p-2 ${
                theme.theme === "light"
                  ? "from-container border-bot"
                  : "from-container-dark border-bot"
              } -mt-2.5 flex gap-x-1 items-center justify-between`}
            >
              <div className="flex">
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (loading) return;
                  if (historyData && historyData.data.data.length === 0) {
                    return Swal.fire("Info!", "No history data found!", "info");
                  }
                  setHistoryModal(true);
                }}
                className="bg-gray p-2 rounded-xl text-white"
              >
                History
              </button>
            </div>
            <div
              className={`px-3 py-[14px] ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } border-b border-bot`}
            >
              <input
                disabled={loading}
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
                type="number"
              />
            </div>
            <div
              className={`px-3 py-[14px] ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } border-b border-bot flex justify-between`}
            >
              <input
                disabled={loading}
                onKeyDown={(evt) => {
                  ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault();
                }}
                value={bankAccountValue}
                onChange={(e) => {
                  e.preventDefault();
                  const re = /^[0-9]*[.,]?[0-9]*$/;

                  if (e.target.value === "" || re.test(e.target.value)) {
                    let temp = e.target.value.replaceAll(",", "");
                    let lastTemp = temp.replaceAll(".", "");
                    setBankAccountValue(lastTemp);
                  }
                  setBankAccountName("");
                }}
                className="skt-w w-full skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-fit focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="Account Number"
                spellCheck={false}
                type="number"
              />
              <a
                onClick={async () => {
                  socket.emit(
                    "check-bank",
                    {
                      wallet_address: account,
                      account_number: bankAccountValue,
                      bank_code: currentSelectedBank.bank_code.toLowerCase(),
                    },
                    (error: any) => {
                      console.log(error, "<<<");
                    }
                  );
                  if (loading) return;
                  if (!bankAccountValue) {
                    return Swal.fire(
                      "Info!",
                      "Bank account number must be filled!",
                      "info"
                    );
                  }
                  try {
                    setIsCheckingBankAccount(true);
                    const getBankAccount = await axiosFlip.post("/inquiry", {
                      account_number: bankAccountValue,
                      bank_code: currentSelectedBank.bank_code.toLowerCase(),
                    });
                    setIsCheckingBankAccount(false);
                    setBankAccountName(getBankAccount.data.account_holder);
                    if (
                      getBankAccount.data.status === "INVALID_ACCOUNT_NUMBER"
                    ) {
                      Swal.fire(
                        "Error!",
                        "Bank account number invalid!",
                        "error"
                      );
                    }
                    if (getBankAccount.data.status === "PENDING") {
                      Swal.fire(
                        "Pending",
                        "Please try again a bit later.",
                        "info"
                      );
                    }
                  } catch (e) {
                    setIsCheckingBankAccount(false);
                    Swal.fire(
                      "Error!",
                      "Bank account number invalid!",
                      "error"
                    );
                    console.log(e, "<<< E!");
                  }
                }}
                className="p-2 cursor-pointer relative mx-auto flex items-center justify-center rounded-full border-4 disabled:opacity-60 middle-btn text-white"
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
                  "Check"
                )}
              </a>
            </div>
            <div
              className={`px-3 py-[14px] ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } border-b border-bot`}
            >
              <input
                value={bankAccountName}
                disabled
                onChange={(e) => {
                  setBankAccountName(e.target.value);
                }}
                className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none min-w-full w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                placeholder="Account Name"
                spellCheck={false}
                type="text"
              />
            </div>
            <div
              className={`rounded-b ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } px-3 py-[14px] flex justify-between items-center`}
            >
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
              disabled={loading || isCheckingBankAccount}
              onClick={async (e) => {
                e.preventDefault();

                try {
                  if (!account) {
                    activateBrowserWallet();
                    return;
                  }
                  if (!alreadySigned) {
                    const result = await signer?.signMessage(
                      "By signing this, you agree to Seamless Finance's terms and conditions."
                    );
                    console.log(result, "<<< RESULT");
                    setAlreadySigned(true);
                    return;
                  }
                  if (insufficientBalance) return;
                  if (
                    !cryptoValue ||
                    !phoneNumber ||
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
                  if (!bankAccountName) {
                    Swal.fire(
                      "Not done!",
                      "Please check for your bank account number!",
                      "warning"
                    );
                    return;
                  }
                  if (!currentSelectedToken?.native) {
                    const tx1 = await approveErc20Send(
                      customContract,
                      utils.parseUnits(
                        cryptoValue,
                        currentSelectedToken?.decimals
                      )
                    );
                  }

                  const encryptedData = {
                    bankAccountName,
                    bankAccountValue,
                    phoneNumber,
                  };
                  const encrypt = CryptoJS.AES.encrypt(
                    JSON.stringify(encryptedData),
                    "blackpink",
                    {
                      format: JsonFormatter,
                    }
                  );

                  if (currentSelectedToken?.native) {
                    const tx = await nativeTransferSeamless(
                      depositAddress,
                      encrypt.toString(),
                      {
                        value: utils.parseUnits(
                          cryptoValue,
                          currentSelectedToken?.decimals
                        ),
                      }
                    );
                    console.log(tx, "<<<");
                  } else {
                    const tx = await transferSeamless(
                      currentSelectedToken?.contractAddress,
                      depositAddress,
                      encrypt.toString(),
                      {
                        value: utils.parseUnits(
                          cryptoValue,
                          currentSelectedToken?.decimals
                        ),
                      }
                    );
                    console.log(tx, "<<< TX!!!");
                  }
                } catch (e: any) {
                  console.log(e?.message.includes("rejected signing"));
                  setLoading(false);
                }
              }}
              className={`mt-5 text-dark rounded font-bold ${
                loading
                  ? "bg-darkGray cursor-not-allowed"
                  : !account
                  ? "mainBtn"
                  : insufficientBalance
                  ? "bg-red/30 cursor-not-allowed"
                  : "mainBtn"
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
              ) : !alreadySigned ? (
                "Sign"
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : (
                "Transfer to Bank"
              )}
            </button>
          </div>
        </div>
        <CustomModal
          tokenModal={tokenModal}
          setTokenModal={setTokenModal}
          currentChain={currentChain}
          setCurrentSelectedToken={setCurrentSelectedToken}
          currentSelectedToken={currentSelectedToken}
        />
        <HistoryModal
          historyModal={historyModal}
          setHistoryModal={setHistoryModal}
          bankData={bankData}
          historyList={historyData}
          setBankAccountValue={setBankAccountValue}
          setCurrentSelectedBank={setCurrentSelectedBank}
          currentSelectedBank={currentSelectedBank}
          setBankAccountName={setBankAccountName}
        />
        <BankModal
          bankModal={bankModal}
          setBankModal={setBankModal}
          bankData={bankData}
          banksList={banksData}
          setCurrentSelectedBank={setCurrentSelectedBank}
          currentSelectedBank={currentSelectedBank}
          setBankAccountName={setBankAccountName}
          setBankAccountValue={setBankAccountValue}
        />
      </div>
    </MainLayout>
  );
}
