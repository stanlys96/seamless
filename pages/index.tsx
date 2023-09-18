"use client";
import { AiOutlineArrowDown, AiFillInfoCircle } from "react-icons/ai";
import { useState } from "react";
import {
  useEtherBalance,
  useEthers,
  useTokenBalance,
  useContractFunction,
  useSigner,
  useCall,
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
import seamlessAbi from "../contracts/seamless-abi.json";
import { useEffect } from "react";
import { formatEther, formatUnits } from "@ethersproject/units";
import { chainData } from "@/utils/helper";
import { MainLayout } from "@/src/layouts/Main";
import { Contract, utils } from "ethers";
import { Bars, ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import { CustomModal } from "@/src/components/CustomModal";
import { BankModal } from "@/src/components/BankModal";
import { JsonFormatter } from "@/utils/crypto";
import { useSelector, useDispatch } from "react-redux";
import { RootState, signActions } from "@/src/stores";
import { HistoryModal } from "@/src/components/HistoryModal";
import CurrencyInput from "react-currency-input-field";
import { Tooltip } from "antd";

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export default function HomePage() {
  const dispatch = useDispatch();
  let periodCheckBank = 0;
  const theme = useSelector((state: RootState) => state.theme);
  const signed = useSelector((state: RootState) => state.sign);
  const erc20Interface = new utils.Interface(erc20Abi);
  const seamlessInterface = new utils.Interface(seamlessAbi);
  const signer = useSigner();
  const { account, activateBrowserWallet, chainId } = useEthers();
  const [loading, setLoading] = useState(false);
  const [cryptoValue, setCryptoValue] = useState("");
  const [idrValue, setIdrValue] = useState("");
  const [tokenModal, setTokenModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [exchangeFee, setExchangeFee] = useState("0");
  const [historyModal, setHistoryModal] = useState(false);
  const [bankAccountValue, setBankAccountValue] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionData, setTransactionData] = useState<any>();
  const [isCheckingBankAccount, setIsCheckingBankAccount] = useState(false);
  const [fee, setFee] = useState(6000);
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
    !currentChain?.seamlessContract
      ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      : currentChain.seamlessContract,
    seamlessInterface
  );

  const { send: approveErc20Send, state: approveErc20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve ERC20 transfer",
    });

  const { send: transferSeamless, state: seamlessState } = useContractFunction(
    seamlessContract,
    "transfer_erc20",
    {
      transactionName: "Transfer ERC20",
    }
  );

  const vaultAddress = useCall({
    contract: seamlessContract,
    method: "vault_address",
    args: [],
  });

  const { send: nativeTransferSeamless, state: nativeSeamlessState } =
    useContractFunction(seamlessContract, "transfer", {
      transactionName: "Transfer",
    });

  const resetFields = () => {
    setCryptoValue("");
    setIdrValue("");
    setFee(6000);
    setExchangeFee("0");
  };
  const { data } = useSWR(
    `/markets?vs_currency=idr&ids=${currentSelectedToken?.coingecko ?? ""}`,
    fetcher
  );
  const { data: banksData } = useSWR(`/banks`, fetcherFlip);
  const { data: balanceData } = useSWR("/balance", fetcherFlip);
  const { data: historyData } = useSWR(
    `/api/wallet-accounts?filters[wallet_address][$eq]=${account}&filters[bank_code][$eq]=${currentSelectedBank.bank_code}`,
    fetcherStrapi
  );
  const nativeBalance = useEtherBalance(account);
  const tokenBalance = useTokenBalance(
    currentSelectedToken?.contractAddress,
    account
  );
  const receiveValue = parseFloat((parseFloat(idrValue) - fee).toFixed(2));
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
  const insufficientDisburse =
    parseFloat(idrValue.replaceAll(",", "")) > (balanceData?.data.balance ?? 0);

  useEffect(() => {
    setCurrentSelectedToken(
      currentChain?.tokenData.find((data) => data.name === "USDC")
    );
  }, [chainId]);

  const addToWalletAccounts = () => {
    axiosStrapi
      .post("/api/check-wallet-accounts", {
        wallet_address: account,
        bank_code: currentSelectedBank.bank_code,
        bank_account_name: bankAccountName,
        bank_account_number: bankAccountValue,
        phone_number: phoneNumber,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addToTransactionHistory = (status: "Approval" | "Blockchain") => {
    const date = new Date(Date.now());
    const dateStr =
      date.getFullYear() +
      "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getDate()).slice(-2) +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2) +
      ("." + date.getMilliseconds()).slice(-4);
    axiosStrapi
      .post("/api/transaction-histories", {
        data: {
          wallet_address: account,
          token: currentSelectedToken?.name,
          chain: chainId?.toString(),
          bank_name: currentSelectedBank.name,
          bank_account_number: bankAccountValue,
          status: status,
          bank_account_name: bankAccountName,
          phone_number: phoneNumber,
          token_value: parseFloat(cryptoValue),
          idr_value: parseFloat(idrValue),
          transaction_success: false,
          wallet_destination: vaultAddress?.value[0] ?? "",
          idempotency_key: "",
          transaction_id: "",
          receipt: "",
          fee: fee,
          receive: Math.ceil(receiveValue),
          start_progress: status === "Blockchain" ? dateStr : null,
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
  const blockchainSuccess = async (tempState: any) => {
    const idempotencyKey =
      chainData.find((data: any) => data.chainId === tempState.chainId)?.name +
      `-${tempState?.transaction?.hash}`;
    try {
      const updateTransactionStatus = await axiosStrapi.put(
        `/api/transaction-histories/${transactionData?.data.id ?? ""}`,
        {
          data: {
            status: "Blockchain Success",
          },
        }
      );
    } catch (e) {
      console.log(e, "<<< Update Transaction Error");
    }
    axiosStrapi
      .post("/api/disbursement", {
        idempotency_key: idempotencyKey,
        account_number: bankAccountValue,
        bank_code: currentSelectedBank.bank_code,
        amount: Math.ceil(receiveValue),
        remark: "Seamless Finance",
      })
      .then(async (res) => {
        const result = res.data;
        await axiosStrapi.put(
          `/api/transaction-histories/${transactionData?.data.id ?? ""}`,
          {
            data: {
              transaction_hash:
                currentChain?.transactionUrl +
                tempState.receipt?.transactionHash,
              gas_price: parseFloat(
                formatEther(tempState.receipt?.effectiveGasPrice ?? "0x0")
              ),
              transaction_success: true,
              block_confirmation:
                tempState.receipt?.confirmations.toString() ?? "0",
              idempotency_key: idempotencyKey,
              transaction_id: result.id.toString(),
              status: "Flip",
            },
          }
        );
        await axiosStrapi.post("/api/flip-transactions", {
          data: {
            account_number: result.account_number,
            amount: result.amount,
            account_name: result.recipient_name,
            idempotency_key: result.idempotency_key,
            bank_code: result.bank_code,
            sender_bank: result.sender_bank,
            transaction_id: result.id.toString(),
            fee: result.fee,
            user_id: result.user_id.toString(),
            receipt: "",
          },
        });
        resetFields();
        setTransactionData(null);
        setTransactionLoading(false);
        Swal.fire(
          "Success!",
          "Transaction successful! Please wait for our admin to contact you.",
          "success"
        );
      });
  };

  const resetCurrency = () => {
    setFee(6000);
    setIdrValue("0");
    setCryptoValue("0");
    setExchangeFee("0");
  };

  const checkBankInquiry: any = async () => {
    const getBankAccount = await axiosFlip.post("/inquiry", {
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

  useEffect(() => {
    if (
      approveErc20State.status.toLowerCase() === "mining" &&
      !transactionLoading
    ) {
      setTransactionLoading(true);
      addToTransactionHistory("Approval");
    }
    if (approveErc20State.status.toLowerCase() === "success") {
      setTransactionLoading(false);
      updateTransactionStatus("Approval Success");
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

  const updateTransactionStatus = async (
    status:
      | "Approval"
      | "Approval Success"
      | "Blockchain"
      | "Blockchain Success"
  ) => {
    try {
      if (status === "Blockchain") {
        const date = new Date();
        const dateStr =
          date.getFullYear() +
          "-" +
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + date.getDate()).slice(-2) +
          " " +
          ("00" + date.getHours()).slice(-2) +
          ":" +
          ("00" + date.getMinutes()).slice(-2) +
          ":" +
          ("00" + date.getSeconds()).slice(-2) +
          ("." + date.getMilliseconds()).slice(-4);
        const updateTransaction = await axiosStrapi.put(
          `/api/transaction-histories/${transactionData?.data.id ?? ""}`,
          {
            data: {
              status: status,
              start_progress: dateStr,
            },
          }
        );
      } else {
        const updateTransaction = await axiosStrapi.put(
          `/api/transaction-histories/${transactionData?.data.id ?? ""}`,
          {
            data: {
              status: status,
            },
          }
        );
      }
    } catch (e) {
      console.log(e, status, "<<< ERR");
    }
  };

  useEffect(() => {
    try {
      const tempState = currentSelectedToken?.native
        ? nativeSeamlessState
        : seamlessState;
      if (tempState.status.toLowerCase() === "mining" && !transactionLoading) {
        setTransactionLoading(true);
        if (tempState === nativeSeamlessState) {
          addToTransactionHistory("Blockchain");
        } else {
          updateTransactionStatus("Blockchain");
        }
      }
      if (tempState.status.toLowerCase() === "success") {
        setTransactionLoading(false);
        blockchainSuccess(tempState);
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
    setBankAccountName("");
    setBankAccountValue("");
  }, [account]);

  useEffect(() => {
    if (historyData && historyData.data.data.length > 0 && !bankAccountName) {
      const theResult = historyData.data.data;
      const latestData = theResult.find((res: any) => res.attributes.latest);
      if (latestData) {
        setBankAccountName(latestData.attributes.bank_account_name);
        setBankAccountValue(latestData.attributes.bank_account_number);
        setPhoneNumber(latestData.attributes.phone_number);
      }
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
            <p className="text-gray">
              Max disburse: Rp{" "}
              {balanceData?.data.balance.toLocaleString("en-US") ?? 0}
            </p>
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
                  <CurrencyInput
                    id="input-example"
                    name="input-name"
                    placeholder="0"
                    disabled={loading}
                    value={cryptoValue}
                    defaultValue={0}
                    decimalsLimit={6}
                    className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                    onValueChange={(value, name) => {
                      setCryptoValue(value ?? "0");
                      if (data) {
                        const idr = (
                          data.data[0].current_price * parseFloat(value ?? "0")
                        ).toFixed(2);
                        const idrFloat = parseFloat(idr);
                        const thisFee = parseFloat(
                          (6000 + idrFloat * 0.005).toFixed(2)
                        );
                        setExchangeFee((idrFloat * 0.005).toFixed(2));
                        setFee(thisFee);
                        setIdrValue(idr === "NaN" ? "0" : idr);
                      }
                    }}
                  />
                  <div className="invisible absolute w-fit text-xl font-bold"></div>
                </div>
                <span className="-z-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (loading || isCheckingBankAccount) return;
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
                    if (loading || isCheckingBankAccount) return;
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
                  if (loading || isCheckingBankAccount) return;
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
                  if (loading || isCheckingBankAccount) return;
                  if (!bankAccountValue) {
                    return Swal.fire(
                      "Info!",
                      "Bank account number must be filled!",
                      "info"
                    );
                  }
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
              <div className="flex gap-x-2 items-center">
                <p className="font-medium text-socket-primary sm:text-lg">
                  Value:
                </p>
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="0"
                  disabled={loading}
                  value={idrValue}
                  defaultValue={0}
                  decimalsLimit={2}
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                  onValueChange={(value, name) => {
                    setIdrValue(value ?? "0");
                    const idrFloat = parseFloat(value ?? "0");
                    setExchangeFee((idrFloat * 0.005).toFixed(2));
                    const thisFee = parseFloat(
                      (6000 + idrFloat * 0.005).toFixed(2)
                    );
                    setFee(thisFee);
                    if (data) {
                      const crypto = (
                        (1 / data.data[0].current_price) *
                        parseFloat(value ?? "0")
                      ).toFixed(6);
                      setCryptoValue(crypto === "NaN" ? "0" : crypto);
                    }
                  }}
                />
              </div>
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
            <div
              className={`rounded-b ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } px-3 py-[14px] border-t flex w-full justify-between items-center`}
            >
              <div className="flex gap-x-2 items-center">
                <div className="flex font-medium text-socket-primary sm:text-lg">
                  <Tooltip
                    title={`Gas Fee: 3,000 IDR
                    Transfer Fee: 3,000 IDR
                    Exchange Fee (0.5%): ${parseFloat(
                      exchangeFee
                    ).toLocaleString("en-US")} IDR
                    Total Fee: ${fee.toLocaleString("en-US")} IDR`}
                  >
                    <AiFillInfoCircle />
                  </Tooltip>
                  <div
                    id="tooltip-light"
                    role="tooltip"
                    className="absolute z-100 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"
                  >
                    Tooltip content
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                  <span className="ml-1">Fee</span>
                  <span>:</span>
                </div>
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="0"
                  disabled
                  value={fee}
                  defaultValue={0}
                  decimalsLimit={6}
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                  onValueChange={(value, name) => {}}
                />
              </div>
              <span>
                <button className="skt-w skt-w-input skt-w-button flex items-center  p-0 hover:bg-transparent bg-transparent cursor-default">
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
            <div
              className={`rounded-b ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } px-3 py-[14px] border-t flex justify-between items-center`}
            >
              <div className="flex gap-x-2 items-center">
                <p className="font-medium text-socket-primary sm:text-lg">
                  Receive:
                </p>
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="0"
                  disabled
                  value={!receiveValue ? 0 : receiveValue}
                  defaultValue={0}
                  decimalsLimit={6}
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                  onValueChange={(value, name) => {}}
                />
              </div>
              <span>
                <button className="skt-w skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent cursor-default">
                  <span className="flex items-center">
                    <div className="relative flex h-fit w-fit">
                      <div className="skt-w h-6 w-6 rounded-full overflow-hidden">
                        <img src="img/indo2.png" width="100%" height="100%" />
                      </div>
                    </div>
                    <span className="cursor-pointer skt-w ml-1 font-medium text-socket-primary sm:text-lg mx-1 flex justify-end items-center gap-x-1">
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
                  if (!signed.signed) {
                    dispatch(signActions.setIsSigning(true));
                    signer
                      ?.signMessage(
                        "By signing this, you agree to Seamless Finance's terms and conditions."
                      )
                      .then((res) => {
                        dispatch(signActions.setIsSigning(false));
                        if (res) {
                          dispatch(signActions.setSign(true));
                        }
                      })
                      .catch((err) => {
                        dispatch(signActions.setIsSigning(false));
                        console.log(err, "<<< err");
                      });
                    return;
                  }
                  if (insufficientBalance || insufficientDisburse) return;
                  if (cryptoValue === "0" || parseFloat(cryptoValue) === 0) {
                    Swal.fire(
                      "Not done!",
                      "Please fill crypto value!",
                      "warning"
                    );
                    return;
                  }
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
                  if (receiveValue <= 0) {
                    Swal.fire(
                      "Not done!",
                      "Receive value must be a positive number!",
                      "warning"
                    );
                    return;
                  }
                  if (!currentSelectedToken?.native) {
                    const tx1 = await approveErc20Send(
                      currentChain?.seamlessContract ?? "",
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
                      encrypt.toString(),
                      {
                        value: utils.parseUnits(
                          cryptoValue,
                          currentSelectedToken?.decimals
                        ),
                      }
                    );
                  } else {
                    const tx = await transferSeamless(
                      currentSelectedToken?.contractAddress,
                      encrypt.toString(),
                      {
                        value: utils.parseUnits(
                          cryptoValue,
                          currentSelectedToken?.decimals
                        ),
                      }
                    );
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
                  : insufficientBalance || insufficientDisburse
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
              ) : !signed.signed ? (
                "Sign"
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : insufficientDisburse ? (
                "Disbursement unavailable"
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
          resetCurrency={resetCurrency}
        />
        <HistoryModal
          setPhoneNumber={setPhoneNumber}
          historyModal={historyModal}
          setHistoryModal={setHistoryModal}
          historyList={historyData}
          setBankAccountValue={setBankAccountValue}
          setCurrentSelectedBank={setCurrentSelectedBank}
          currentSelectedBank={currentSelectedBank}
          setBankAccountName={setBankAccountName}
        />
        <BankModal
          bankModal={bankModal}
          setBankModal={setBankModal}
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
