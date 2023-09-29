"use client";
import {
  AiOutlineArrowDown,
  AiFillInfoCircle,
  AiOutlineInsertRowBelow,
  AiOutlineArrowUp,
} from "react-icons/ai";
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
import { chainData, faqData, supportedChains } from "@/utils/helper";
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
import Typed from "react-typed";
import { Collapse } from "react-collapse";
import { SelectNetworkModal } from "@/src/components/SelectNetworkModal";
// delay
const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  let periodCheckBank = 0;
  const [theState, setTheState] = useState(0);
  const theme = useSelector((state: RootState) => state.theme);
  const signed = useSelector((state: RootState) => state.sign);
  const erc20Interface = new utils.Interface(erc20Abi);
  const seamlessInterface = new utils.Interface(seamlessAbi);
  const signer = useSigner();
  const [openCollapse, setOpenCollapse] = useState(false);
  const { account, activateBrowserWallet, chainId } = useEthers();
  const [loading, setLoading] = useState(false);
  const [cryptoValue, setCryptoValue] = useState("");
  const [idrValue, setIdrValue] = useState("");
  const [tokenModal, setTokenModal] = useState(false);
  const [networkModal, setNetworkModal] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [exchangeFee, setExchangeFee] = useState("0");
  const [historyModal, setHistoryModal] = useState(false);
  const [bankAccountValue, setBankAccountValue] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionData, setTransactionData] = useState<any>();
  const [isCheckingBankAccount, setIsCheckingBankAccount] = useState(false);
  const [hasLatestData, setHasLatestData] = useState(false);
  const [fee, setFee] = useState(6000);
  const [currentSelectedBank, setCurrentSelectedBank] = useState({
    name: "BCA",
    bank_code: "bca",
    imgUrl: "/img/banks/bca.png",
  });
  const [receiveValue, setReceiveValue] = useState(0);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [openData, setOpenData] = useState(
    faqData.map((faq) => ({ id: faq.id, open: false }))
  );

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
    setReceiveValue(0);
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
  const chainSupported = supportedChains.includes(chainId ?? 0);
  const receiveValueError = receiveValue < 10000;
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
        // console.log(res.data);
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
        // console.log(res.data);
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
    setCryptoValue("");
    setIdrValue("");
    setFee(6000);
    setExchangeFee("0");
    setReceiveValue(0);
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
    setPhoneNumber("");
  }, [account]);

  useEffect(() => {
    if (historyData && historyData.data.data.length > 0 && !bankAccountName) {
      const theResult = historyData.data.data;
      const latestData = theResult.find((res: any) => res.attributes.latest);
      if (latestData) {
        setBankAccountName(latestData.attributes.bank_account_name);
        setBankAccountValue(latestData.attributes.bank_account_number);
        setPhoneNumber(latestData.attributes.phone_number);
        setHasLatestData(true);
      } else {
        setHasLatestData(false);
      }
    }
    if (!historyData) {
      setHasLatestData(false);
    }
    // console.log(hasLatestData);
  }, [historyData]);

  return (
    <MainLayout>
      <div className="the-container relative">
        <p className={`text-gray text-center py-3 text-[11px] md:text-[16px]`}>
          This product is still in beta.
          <br />
          If you run into any issue please let us know in our discord server
        </p>
        <div className="w-full flex justify-center items-center gap-x-[30px]">
          <div className="text-black md:grid hidden grid grid-cols-2 text-[35px] font-bold gap-y-[30px] gap-x-[10px]">
            <div
              className={`text-right ${
                theme.theme === "light" ? "text-[#4c4c4c]" : "text-white"
              }`}
            >
              You Can Use
            </div>
            {/* <div className="text-left underline">USDC</div> */}
            <Typed
              strings={["USDC", "Matic", "USDT", "Dai", "WBTC", "WETH"]}
              typeSpeed={150}
              backSpeed={100}
              loop
              className={`underline ${
                theme.theme === "light" ? "text-dark" : "text-[#FFE7BE]"
              }`}
            />
            <div
              className={`text-right ${
                theme.theme === "light" ? "text-[#4c4c4c]" : "text-white"
              }`}
            >
              From
            </div>
            <Typed
              strings={[
                "Ethereum",
                "Arbitrum",
                "Polygon",
                "Optimism",
                "Aurora",
                "Base",
                "Binance",
              ]}
              typeSpeed={150}
              backSpeed={100}
              loop
              className={`underline ${
                theme.theme === "light" ? "text-dark" : "text-[#FFE7BE]"
              }`}
            />
            <div
              className={`text-right ${
                theme.theme === "light" ? "text-[#4c4c4c]" : "text-white"
              }`}
            >
              To
            </div>
            <div
              className={`underline text-left ${
                theme.theme === "light" ? "text-dark" : "text-[#FFE7BE]"
              }`}
            >
              Pay
            </div>
            <div
              className={`text-right ${
                theme.theme === "light" ? "text-[#4c4c4c]" : "text-white"
              }`}
            >
              Directly To
            </div>
            <Typed
              strings={["BCA", "GoPay", "OVO", "Shopee Pay", "Tokopedia"]}
              typeSpeed={150}
              backSpeed={100}
              loop
              className={`underline ${
                theme.theme === "light" ? "text-dark" : "text-[#FFE7BE]"
              }`}
            />
          </div>
          <div
            className={`${
              theme.theme === "light"
                ? "primary-container"
                : "primary-container-dark"
            } transition duration-500 w-[100vw] rounded-xl p-6 sm:w-[520px] sm:min-w-[520px]`}
          >
            <div
              className={`flex w-full justify-center items-center transition duration-500 mb-4 ${
                theme.theme === "light" ? "text-dark" : "text-light"
              }`}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
                className={`${
                  router.pathname === "/"
                    ? `${
                        theme.theme === "light" ? "text-black" : "text-white"
                      } underline`
                    : `text-gray`
                } font-bold cursor-pointer transfer-btn`}
              >
                TRANSFER
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/transactions");
                }}
                className={`${
                  router.pathname === "/"
                    ? "text-gray"
                    : `${
                        theme.theme === "light" ? "text-black" : "text-white"
                      } underline`
                } font-bold cursor-pointer transfer-btn-light`}
              >
                HISTORY
              </a>
            </div>
            {/* <p className="text-gray">
              Max disburse: Rp{" "}
              {balanceData?.data.balance.toLocaleString("en-US") ?? 0}
            </p> */}
            <p className="font-bold text-xl">Sending</p>
            <div
              className={`rounded-t p-2 ${
                theme.theme === "light"
                  ? "from-container"
                  : "from-container-dark"
              } mt-2 flex justify-between  ${
                insufficientBalance || receiveValueError
                  ? "border-l border-t border-r border-red"
                  : "border-l border-t border-r border-transparent"
              }`}
            >
              <div className="flex">
                <p className="text-gray">From</p>
                <button
                  onClick={() => {
                    setNetworkModal(true);
                  }}
                  className={`skt-w cursor-pointer skt-w-input skt-w-button flex items-center p-2 flex-shrink-0 w-auto py-0 hover:bg-transparent bg-transparent justify-start sm:justify-between cursor-default`}
                >
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
                    <AiOutlineArrowDown />
                  </span>
                </button>
              </div>
              <p className="text-gray">
                Bal: {`${usedBalance} ${currentSelectedToken?.name}`}
              </p>
            </div>
            <div
              className={`${
                insufficientBalance || receiveValueError
                  ? "border-t border-red"
                  : "border-t border-mainGray2"
              }`}
            >
              <div
                className={`rounded-b ${
                  theme.theme === "light" ? "to-container" : "to-container-dark"
                } flex items-center justify-between px-3 py-[14px] sm:py-4 ${
                  insufficientBalance || receiveValueError
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
                    onFocus={undefined}
                    onKeyUp={undefined}
                    onSubmit={undefined}
                    onSubmitCapture={undefined}
                    onChangeCapture={undefined}
                    className={`skt-w border-b ${
                      insufficientBalance || receiveValueError
                        ? "border-red"
                        : theme.theme === "dark"
                        ? "border-white"
                        : "border-black"
                    } skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full`}
                    onValueChange={(value, name) => {
                      if (value === cryptoValue) return;
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
                        setReceiveValue(
                          parseFloat((parseFloat(idr) - thisFee).toFixed(2))
                        );
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
            <p className="text-red mt-1">
              {insufficientBalance
                ? "You have inputted value more than your balance"
                : receiveValueError
                ? "Minimal receive value is 10,000 IDR"
                : ""}
            </p>
            {/* <a className="relative mx-auto -mt-2.5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 disabled:opacity-60 middle-btn text-white">
              <AiOutlineArrowDown />
            </a> */}
            <p className="font-bold text-xl mt-4 mb-2">Receiving</p>
            <div
              className={`rounded-t p-2 ${
                theme.theme === "light"
                  ? "from-container border-bot"
                  : "from-container-dark border-bot"
              } flex gap-x-1 items-center justify-between`}
            >
              <div className="flex">
                <p className="font-medium text-socket-primary sm:text-lg">
                  Destination: &nbsp;
                </p>
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
              } border-b border-bot flex justify-between`}
            >
              <div className="flex items-center">
                <p className="font-medium text-socket-primary sm:text-lg w-fit">
                  Account&nbsp;Number:&nbsp;
                </p>
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
                  className="skt-w w-full skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-fit focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full overflow-hidden"
                  placeholder="Account Number"
                  spellCheck={false}
                  type="number"
                />
              </div>
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
              <div className="flex items-center flex-wrap">
                <p className="font-medium text-socket-primary sm:text-lg w-fit">
                  Account&nbsp;Name:&nbsp;
                </p>
                <input
                  value={bankAccountName}
                  disabled
                  onChange={(e) => {
                    setBankAccountName(e.target.value);
                  }}
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl"
                  placeholder="Account Name"
                  spellCheck={false}
                  type="text"
                />
              </div>
            </div>
            {/* <div
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
                  value={idrValue}
                  defaultValue={0}
                  decimalsLimit={2}
                  disabled
                  className="skt-w skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full"
                  onValueChange={(value, name) => {
                    setIdrValue(value ?? "0");
                    const idrFloat = parseFloat(value ?? "0");
                    setExchangeFee((idrFloat * 0.005).toFixed(2));
                    const thisFee = parseFloat(
                      (6000 + idrFloat * 0.005).toFixed(2)
                    );
                    setFee(thisFee);
                    setReceiveValue(idrFloat - thisFee);
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
            </div> */}
            {/* <div
              className={`rounded-b ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } px-3 py-[14px] flex w-full justify-between items-center`}
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
            </div> */}
            <div
              className={`rounded-b ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } px-3 py-[14px] border-gray flex justify-between items-center`}
            >
              <div className="flex gap-x-2 items-center">
                <p className="font-medium text-socket-primary sm:text-lg">
                  Amount&nbsp;Receiving:
                </p>
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="0"
                  value={!receiveValue ? 0 : receiveValue}
                  defaultValue={0}
                  decimalsLimit={6}
                  disabled={loading}
                  className={`skt-w border-b animated-input ${
                    receiveValueError
                      ? "border-red text-red"
                      : theme.theme === "dark"
                      ? "border-white text-white"
                      : "border-black text-black"
                  } skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none text-lg sm:text-xl max-w-[180px] sm:max-w-full`}
                  onValueChange={(value, name) => {
                    if (value === receiveValue.toString()) return;
                    setReceiveValue(parseFloat(value ?? "0"));
                    const idrValueFloat =
                      (parseFloat(value ?? "0") + 6000) * 1.005;
                    setIdrValue(idrValueFloat.toFixed(2));
                    const theFee = parseFloat(
                      (idrValueFloat - parseFloat(value ?? "0")).toFixed(2)
                    );
                    setFee(theFee);
                    setExchangeFee((theFee - 6000).toFixed(2));
                    if (data) {
                      const crypto = (
                        (1 / data.data[0].current_price) *
                        idrValueFloat
                      ).toFixed(6);
                      setCryptoValue(crypto === "NaN" ? "0" : crypto);
                    }
                  }}
                />
              </div>
              <span>
                <button className="skt-w skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent cursor-default">
                  <span className="flex justify-center items-center relative h-fit w-fit">
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
            {/* <div
              className={`px-3 py-[14px] ${
                theme.theme === "light" ? "to-container" : "to-container-dark"
              } border-t border-gray`}
            >
              <div className="flex items-center">
                <p className="font-medium text-socket-primary sm:text-lg w-fit">
                  Phone&nbsp;Number&nbsp;(WhatsApp):&nbsp;
                </p>
                <input
                  disabled={loading || hasLatestData}
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
                  className="skt-w skt-w-input text-socket-primary w-1/2 bg-transparent font-bold pt-0.5 focus-visible:outline-none w-fit focus:max-w-none text-lg sm:text-xl overflow-hidden"
                  placeholder="Phone"
                  spellCheck={false}
                  type="number"
                />
              </div>
            </div> */}
            <button
              disabled={loading || isCheckingBankAccount}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  if (!account) {
                    activateBrowserWallet();
                    return;
                  }
                  if (!chainSupported) {
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
                  if (
                    insufficientBalance ||
                    insufficientDisburse ||
                    receiveValueError
                  )
                    return;

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
                  if (receiveValue < 10000) {
                    Swal.fire(
                      "Not done!",
                      "Receive value must be at least 10000!",
                      "warning"
                    );
                    return;
                  }
                  if (!currentChain?.seamlessContract) {
                    return Swal.fire(
                      "Internal Error!",
                      "Internal error, please contact admin",
                      "error"
                    );
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
                  let secretKey;
                  if (process.env.NEXT_PUBLIC_SECRET_PHRASE) {
                    secretKey = process.env.NEXT_PUBLIC_SECRET_PHRASE;
                  } else {
                    secretKey = "superjunior";
                  }
                  const encrypt = CryptoJS.AES.encrypt(
                    JSON.stringify(encryptedData),
                    secretKey,
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
              className={`mt-5 rounded font-bold ${
                loading
                  ? "bg-darkGray cursor-not-allowed"
                  : !account || !signed.signed
                  ? "mainBtn"
                  : insufficientBalance ||
                    insufficientDisburse ||
                    !chainSupported ||
                    receiveValueError
                  ? "bg-red/30 cursor-not-allowed"
                  : "mainBtn"
              } ${
                theme.theme === "dark" ? "text-white" : "text-black"
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
              ) : !chainSupported ? (
                "Chain Not Supported"
              ) : !signed.signed ? (
                "Sign"
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : receiveValueError ? (
                "Min receive value is 10,000 IDR"
              ) : insufficientDisburse ? (
                "Disbursement unavailable"
              ) : (
                "Transfer to Bank"
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col justify-center items-center mt-5 w-full px-[20px] lg:px-[325px] ${
            theme.theme === "light" ? "text-black" : "text-white"
          }`}
        >
          <p className="text-[40px]">FAQ</p>
          {faqData.map((faq: any, idx: number) => (
            <div
              key={faq.id}
              className={`flex collapsie flex-col justify-between items-center w-full text-[16px] md:text-[20px] py-2 border-t no-scrollbar ${
                faq.id === faqData.length && "border-b"
              }`}
            >
              <div
                onClick={() => {
                  faq.open = !faq.open;
                  setTheState((prevState) => prevState + 1);
                }}
                className="flex w-full justify-between items-center cursor-pointer collapse-content overflow-hidden no-scrollbar"
              >
                <p>{faq.question}</p>
                <div className={`${faq.open ? "rotate-0" : "rotate-180"}`}>
                  <AiOutlineArrowUp />
                </div>{" "}
              </div>
              <div
                className="collapse-content no-scrollbar overflow-x-scroll"
                style={{
                  maxHeight: faq.open ? "400px" : 0,
                }}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
        <SelectNetworkModal
          networkModal={networkModal}
          setNetworkModal={setNetworkModal}
        />
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
          setPhoneNumber={setPhoneNumber}
        />
      </div>
    </MainLayout>
  );
}
