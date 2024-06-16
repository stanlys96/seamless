import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import {
    axiosSecondary,
    axiosApi,
    fetcher,
    fetcherFlip,
    fetcherStrapi,
} from "@/utils/axios";
import erc20Abi from "../../contracts/erc20-abi.json";
import seamlessAbi from "../../contracts/seamless-abi.json";
import { useEffect } from "react";
import { formatEther, formatUnits } from "@ethersproject/units";
import { chainData, faqData, supportedChains } from "@/utils/helper";
import { MainLayout } from "@/src/layouts/Main";
import { BigNumber, Contract, utils } from "ethers";
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
import Typed from "react-typed";
import { SelectNetworkModal } from "@/src/components/SelectNetworkModal";
import { ReferralModal } from "@/src/components/ReferralModal";
import {
    useAccount,
    useNetwork,
    useContractWrite,
    usePrepareContractWrite,
    useContractRead,
    useBalance,
    useToken,
    useWaitForTransaction,
    useSignMessage,
} from "wagmi";
import { Timeline } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { SelectBuyNetworkModal } from "./SelectBuyNetworkModal";

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

interface BuyComponentProps {
    currentCategory: "sell" | "buy";
    setCurrentCategory: (category: "sell" | "buy") => void;
}

export const BuyComponent = ({
    currentCategory,
    setCurrentCategory,
}: BuyComponentProps) => {
    const [feesOpen, setFeesOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    let periodCheckBank = 0;
    const [theState, setTheState] = useState(0);
    const theme = useSelector((state: RootState) => state.theme);
    const signed = useSelector((state: RootState) => state.sign);
    const referral = useSelector((state: RootState) => state.referral);
    const erc20Interface = new utils.Interface(erc20Abi);
    const seamlessInterface = new utils.Interface(seamlessAbi);
    const { chain, chains } = useNetwork();
    const { address, connector, isConnected } = useAccount();
    const [alreadyApproved, setAlreadyApproved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cryptoValue, setCryptoValue] = useState("");
    const [idrValue, setIdrValue] = useState("");
    const [tokenModal, setTokenModal] = useState(false);
    const [networkModal, setNetworkModal] = useState(false);
    const [bankModal, setBankModal] = useState(false);
    const [exchangeFee, setExchangeFee] = useState("0");
    const [historyModal, setHistoryModal] = useState(false);
    const [bankAccountValue, setBankAccountValue] = useState("");
    const [selectedWalletAddress, setSelectedWalletAddress] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [transactionData, setTransactionData] = useState<any>();
    const [isCheckingBankAccount, setIsCheckingBankAccount] = useState(false);
    const [hasLatestData, setHasLatestData] = useState(false);
    const [coingeckoError, setCoingeckoError] = useState(false);
    const [fee, setFee] = useState(6000);
    const [currentIdrPrice, setCurrentIdrPrice] = useState(0);
    const [currentFixedFee, setCurrentFixedFee] = useState(0);
    const [currentSelectedBank, setCurrentSelectedBank] = useState({
        name: "BCA",
        bank_code: "bca",
        imgUrl: "/img/banks/bca.png",
    });
    const [receiveValue, setReceiveValue] = useState(0);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const arbitrumChainData = chainData.find((data) => data.chainId === 42161);
    const [currentSelectedNetwork, setCurrentSelectedNetwork] =
        useState<any>(arbitrumChainData);

    const currentChain = chainData.find(
        (data) => data.chainId === currentSelectedNetwork?.chainId
    );

    const {
        data: signMessageData,
        error: signError,
        isLoading: signIsLoading,
        signMessage,
        variables,
    } = useSignMessage();

    // const {
    //   data: erc20Data,
    //   isLoading: erc20Loading,
    //   isSuccess: erc20Success,
    //   writeAsync: erc20Write,
    //   status: erc20Status,
    // } = useContractWrite({
    //   address: `0x${
    //     currentSelectedToken?.contractAddress ??
    //     "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    //   }`,
    //   abi: erc20Abi,
    //   functionName: "approve",
    //   args: [],
    // });

    const {
        data: transferERC20Data,
        isLoading: transferERC20Loading,
        isSuccess: transferERC20Success,
        writeAsync: transferERC20Write,
        status: transferERC20Status,
    } = useContractWrite({
        address: `0x${
            currentChain?.seamlessContract ??
            "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        }`,
        abi: seamlessAbi,
        functionName: "transfer_erc20",
    });

    const {
        data: vaultAddress,
        isError,
        isLoading,
    } = useContractRead({
        address: `0x${
            currentChain?.seamlessContract ??
            "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        }`,
        abi: seamlessAbi,
        functionName: "vault_address",
    });
    const ethereumChainData = chainData.find((data) => data.chainId === 1);

    const [currentSelectedToken, setCurrentSelectedToken] = useState(
        arbitrumChainData?.tokenData.find((data: any) => data.name === "USDC")
    );

    const { data, mutate: coingeckoMutate } = useSWR(
        `/markets?vs_currency=idr&ids=${currentSelectedToken?.coingecko ?? ""}`,
        fetcher
    );

    const currentPrice = data?.data[0].current_price;
    const { data: banksData } = useSWR(`/banks`, fetcherFlip);
    const { data: balanceData } = useSWR("/balance", fetcherFlip);
    const { data: historyData } = useSWR(
        `/api/wallet-accounts?filters[wallet_address][$eq]=${address}`,
        fetcherStrapi
    );

    const nativeBalance = useBalance({
        // @ts-ignore
        address: "0x" + process.env.NEXT_PUBLIC_WALLET_LIQUIDITY,
        chainId: currentSelectedNetwork?.chainId,
    });

    const tokenBalance = useBalance({
        // @ts-ignore
        address: "0x" + process.env.NEXT_PUBLIC_WALLET_LIQUIDITY,
        token: `0x${
            currentSelectedToken?.contractAddress ??
            "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        }`,
        chainId: currentSelectedNetwork?.chainId,
    });

    const { data: tokenAllowance } = useContractRead({
        address: `0x${currentSelectedToken?.contractAddress ?? ""}`,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, `0x${currentChain?.seamlessContract}`],
    });

    const needApproval =
        parseFloat(cryptoValue) >
        parseFloat(
            formatUnits(
                BigNumber.from(tokenAllowance ?? "0"),
                currentSelectedToken?.decimals
            )
        );
    const usedBalance = currentSelectedToken?.native
        ? parseFloat(
              formatUnits(
                  nativeBalance.data?.value ?? "0x00",
                  currentSelectedToken?.decimals
              ).slice(0, 8)
          )
        : parseFloat(
              formatUnits(
                  tokenBalance.data?.value ?? "0x00",
                  currentSelectedToken?.decimals
              ).slice(0, 8)
          );
    const insufficientBalance = parseFloat(cryptoValue ?? "0") > usedBalance;
    const insufficientDisburse =
        parseFloat(idrValue.replaceAll(",", "")) >
        (balanceData?.data.balance ?? 0);
    const chainSupported = supportedChains.includes((chain?.id ?? 1) as any);
    const receiveValueError = receiveValue < 10000;
    const [approvalHash, setApprovalHash] = useState("");
    const [encrypted, setEncrypted] = useState("");

    const addToWalletAccounts = () => {
        axiosApi
            .post("/api/check-wallet-accounts", {
                wallet_address: address,
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

    const addToTransactionHistory = (
        status: "Approval" | "Blockchain",
        tempState?: any
    ) => {
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
        let idempotencyKey = "";
        idempotencyKey = tempState
            ? chainData.find((data: any) => data.chainId === chain?.id)?.name +
              `-${tempState}`
            : "";
        axiosApi
            .post("/api/transaction-histories", {
                data: {
                    wallet_address: address,
                    token: currentSelectedToken?.name,
                    chain: chain?.id?.toString(),
                    bank_name: currentSelectedBank.name,
                    bank_account_number: bankAccountValue,
                    status: status,
                    bank_account_name: bankAccountName,
                    phone_number: phoneNumber,
                    token_value: parseFloat(cryptoValue),
                    idr_value: parseFloat(idrValue),
                    transaction_success: false,
                    wallet_destination: vaultAddress ?? "",
                    idempotency_key: idempotencyKey,
                    transaction_hash:
                        status === "Blockchain"
                            ? currentChain?.transactionUrl + tempState
                            : "",
                    transaction_id: "",
                    receipt: "",
                    fee: fee,
                    receive: Math.ceil(receiveValue),
                    start_progress: status === "Blockchain" ? dateStr : null,
                    bank_code: currentSelectedBank.bank_code,
                },
            })
            .then((res) => {
                if (status === "Blockchain") {
                    setTransactionData(null);
                    setTransactionLoading(false);
                    setLoading(false);
                    resetCurrency();
                    Swal.fire(
                        "Success!",
                        "Transaction started successfully! Please wait approximately 1 minute to receive your IDR!",
                        "success"
                    );
                } else {
                    setTransactionData(res.data);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const resetCurrency = () => {
        setCryptoValue("");
        setIdrValue("");
        setFee(0);
        setExchangeFee("0");
        setReceiveValue(0);
    };

    const liquidityUnavailable = currentSelectedToken?.native
        ? parseFloat(nativeBalance?.data?.formatted ?? "0") <
          parseFloat(cryptoValue ?? "0")
        : parseFloat(tokenBalance?.data?.formatted ?? "0") <
          parseFloat(cryptoValue ?? "0");

    useEffect(() => {
        setCurrentSelectedToken(
            currentChain?.tokenData.find((data) => data.name === "USDC")
        );
    }, [currentSelectedNetwork]);

    useEffect(() => {
        if (address) {
            if (!data) {
                setCoingeckoError(true);
            } else {
                if (coingeckoError) {
                    setCoingeckoError(false);
                    resetCurrency();
                }
                const currentPrice = data.data[0].current_price;
                const fixedFee = 6000 / parseFloat(currentPrice.toFixed(2));
                setCurrentIdrPrice(currentPrice);
                setCurrentFixedFee(fixedFee);
            }
        }
    }, [address, data]);
    return (
        <div className="the-container relative mb-5">
            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className={`${
                        theme.theme === "light"
                            ? "primary-container"
                            : "primary-container-dark"
                    } transition duration-500 rounded-xl p-6 mt-[20px]`}
                >
                    <div className="bg-container flex justify-between items-center md:px-[24px] px-[10px] py-[10px] rounded-[12px]">
                        <div className="text-white">
                            <p className="font-medium text-socket-primary sm:text-lg">
                                Paying
                            </p>
                            <CurrencyInput
                                name="input-name"
                                placeholder="0"
                                value={!receiveValue ? 0 : receiveValue}
                                defaultValue={0}
                                decimalsLimit={8}
                                disabled={loading}
                                className={`skt-w 
                  ${
                      insufficientBalance || receiveValueError
                          ? "border-red"
                          : theme.theme === "dark"
                          ? "border-white"
                          : "border-black"
                  } 
                  skt-w-input text-[20px] md:text-[34px] text-cute bg-transparent font-bold pt-0.5 focus-visible:outline-none focus:max-w-none sm:max-w-full`}
                                onValueChange={(value, name) => {
                                    if (value === receiveValue.toString())
                                        return;
                                    const idrValueFloat = parseFloat(
                                        value ?? "0"
                                    );
                                    setIdrValue(idrValueFloat.toFixed(2));
                                    if (data) {
                                        const crypto = (
                                            (1 / data.data[0].current_price) *
                                            idrValueFloat
                                        ).toFixed(6);
                                        const thisFee = parseFloat(
                                            (
                                                currentFixedFee +
                                                parseFloat(crypto ?? "0") *
                                                    0.008
                                            ).toFixed(2)
                                        );
                                        setExchangeFee(
                                            (
                                                parseFloat(crypto ?? "0") *
                                                0.008
                                            ).toPrecision(2)
                                        );
                                        setFee(thisFee);
                                        setReceiveValue(
                                            parseFloat(idrValueFloat.toFixed(5))
                                        );
                                        setCryptoValue(
                                            crypto === "NaN"
                                                ? "0"
                                                : (
                                                      parseFloat(crypto) -
                                                      thisFee
                                                  ).toFixed(5)
                                        );
                                    }
                                }}
                            />
                        </div>

                        <span>
                            <button className="skt-w skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent cursor-default">
                                <span className="flex justify-center items-center relative h-fit w-fit">
                                    <img
                                        className="skt-w mr-1 w-[40px] h-[40px] rounded-full"
                                        src="img/indo2.png"
                                    />
                                    <span className="skt-w ml-1 font-medium text-socket-primary text-[18px] text-white mx-1">
                                        IDR
                                    </span>
                                </span>
                            </button>
                        </span>
                    </div>
                    <div className="flex items-center gap-x-1 mt-4">
                        <img src="/img/mingcute_warning-fill.svg" />
                        <span className="text-cute text-[11px] md:text-[14px]">
                            Minimal pay value is 10,000 IDR
                        </span>
                    </div>
                    <div className="bg-container my-[25px] flex justify-between items-center md:px-[24px] px-[10px] py-[10px] rounded-[12px]">
                        <div className="text-white">
                            <p className="font-medium text-socket-primary sm:text-lg">
                                Wallet Address: &nbsp;
                            </p>
                            <input
                                disabled={loading}
                                onKeyDown={(evt) => {
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                        evt.preventDefault();
                                }}
                                value={selectedWalletAddress}
                                onChange={(e) => {
                                    setSelectedWalletAddress(e.target.value);
                                }}
                                className="skt-w w-full text-[20px] md:text-[34px] text-cute skt-w-input text-socket-primary bg-transparent font-bold pt-0.5 focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                                placeholder="Wallet Address"
                                spellCheck={false}
                                type="text"
                            />
                        </div>
                        <button
                            onClick={async (e) => {
                                if (address) {
                                    setSelectedWalletAddress(address);
                                } else {
                                    Swal.fire(
                                        "Oops!",
                                        "Please click the connect wallet button!",
                                        "warning"
                                    );
                                }
                            }}
                            className="bg-gray py-[12px] px-[16px] bg-btn rounded-xl text-white font-bold"
                        >
                            Use Connected
                        </button>
                    </div>
                    <div
                        onClick={() => {
                            if (currentCategory === "sell") {
                                setCurrentCategory("buy");
                            } else {
                                setCurrentCategory("sell");
                            }
                        }}
                        className="cursor-pointer mt-[10px] mb-[15px] relative h-[40px] flex justify-center items-center"
                    >
                        <div className="border-b border-someDark w-full"></div>
                        <img className="absolute left-1/2" src="/img/btn.svg" />
                    </div>
                    {/* <a className="relative mx-auto -mt-2.5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 disabled:opacity-60 middle-btn text-white">
              <AiOutlineArrowDown />
            </a> */}
                    <div className="bg-container flex justify-between items-center md:px-[24px] px-[10px] py-[20px] rounded-[12px]">
                        <div className="flex text-white">
                            <p className="font-medium text-socket-primary sm:text-lg">
                                Destination: &nbsp;
                            </p>
                            <div
                                onClick={(e) => {
                                    if (loading || isCheckingBankAccount)
                                        return;
                                    setNetworkModal(true);
                                }}
                                className="cursor-pointer flex gap-x-1 items-center"
                            >
                                <div className="skt-w flex items-center bg-white rounded-full overflow-hidden w-5 h-5 sm:w-6 sm:h-6">
                                    <img
                                        src={currentSelectedNetwork.imgUrl}
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                                <p>{currentSelectedNetwork.name}</p>
                                <AiOutlineArrowDown />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`ml-[10px] relative ${
                            !feesOpen ? "vertical-line" : "vertical-line-open"
                        }`}
                    >
                        <div className="first-item flex gap-x-2">
                            <Image
                                src="/img/item.svg"
                                height={24}
                                width={24}
                                alt="walao"
                            />
                            <span className="text-secondGray">
                                1 {currentSelectedToken?.name} ={" "}
                                {currentPrice?.toLocaleString("US")} IDR
                            </span>
                        </div>
                        <div
                            onClick={() =>
                                setFeesOpen((prevState) => !prevState)
                            }
                            className="second-item flex gap-x-2 cursor-pointer"
                        >
                            <Image
                                src="/img/hide.svg"
                                height={24}
                                width={24}
                                alt="walao"
                            />
                            <span className="text-secondGray">
                                {!feesOpen ? "See fees calculation" : "Hide"}
                            </span>
                        </div>
                        {feesOpen && (
                            <div className="third-item flex gap-x-2">
                                <Image
                                    src="/img/small-dot.svg"
                                    height={8}
                                    width={8}
                                    alt="walao"
                                />
                                <span className="text-secondGray">
                                    {currentFixedFee.toPrecision(2)}{" "}
                                    {currentSelectedToken?.name} Processing Fee
                                </span>
                            </div>
                        )}
                        {feesOpen && (
                            <div className="fourth-item flex gap-x-2">
                                <Image
                                    src="/img/small-dot.svg"
                                    height={8}
                                    width={8}
                                    alt="walao"
                                />
                                <span className="text-secondGray">
                                    {parseFloat(exchangeFee ?? "0")
                                        .toPrecision(2)
                                        .toLocaleString()}{" "}
                                    {currentSelectedToken?.name} Seamless Fee
                                </span>
                            </div>
                        )}
                        <div
                            className={`${
                                feesOpen
                                    ? "fifth-item-opened"
                                    : "fifth-item-closed"
                            } flex gap-x-2`}
                        >
                            <Image
                                src="/img/minus.svg"
                                height={24}
                                width={24}
                                alt="walao"
                            />
                            <span className="text-secondGray">
                                {fee?.toPrecision(2).toLocaleString()}{" "}
                                {currentSelectedToken?.name}{" "}
                                <span className="text-white ml-1">
                                    Total fees
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between bg-container md:px-[24px] px-[10px] py-[10px] rounded-[12px] ">
                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center text-white">
                                <span className="text-[16px]">
                                    Receiving in{" "}
                                </span>
                                <button
                                    onClick={() => {
                                        setNetworkModal(true);
                                    }}
                                    className={`skt-w text-[16px] cursor-pointer skt-w-input skt-w-button flex items-center p-2 flex-shrink-0 w-auto py-0 hover:bg-transparent bg-transparent justify-start sm:justify-between cursor-default`}
                                >
                                    <span className="flex items-center">
                                        <div className="relative flex h-fit w-fit">
                                            <div className="skt-w rounded-full overflow-hidden w-5 h-5 sm:w-6 sm:h-6">
                                                <img
                                                    src={
                                                        currentSelectedNetwork?.imgUrl ??
                                                        "/img/Ether.svg"
                                                    }
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
                                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]"></span>
                                            </span>
                                        </div>
                                        <span className="skt-w ml-1 -mb-0.5 font-medium text-white text-[16px]">
                                            {currentSelectedNetwork?.name ??
                                                "Ethereum"}
                                        </span>
                                        <AiOutlineArrowDown />
                                    </span>
                                </button>
                            </div>
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
                                transformRawValue={(value: any) => {
                                    if (value[value.length - 1] === ",") {
                                        return value + ".";
                                    }
                                    return value;
                                }}
                                className={`skt-w 
                  ${
                      insufficientBalance || receiveValueError
                          ? "border-red"
                          : theme.theme === "dark"
                          ? "border-white"
                          : "border-black"
                  } 
                  skt-w-input text-[20px] md:text-[34px] text-cute bg-transparent font-bold pt-0.5 focus-visible:outline-none focus:max-w-none sm:max-w-full`}
                                onValueChange={(value, name) => {
                                    if (value === cryptoValue) return;
                                    setCryptoValue(value ?? "0");
                                    if (data) {
                                        const currentPrice =
                                            data.data[0].current_price;
                                        const idr = (
                                            currentPrice *
                                            parseFloat(value ?? "0")
                                        ).toFixed(2);
                                        const thisFee = parseFloat(
                                            (
                                                currentFixedFee +
                                                parseFloat(value ?? "0") * 0.008
                                            ).toFixed(2)
                                        );
                                        setExchangeFee(
                                            (
                                                parseFloat(value ?? "0") * 0.008
                                            ).toFixed(2)
                                        );
                                        setFee(thisFee);
                                        setIdrValue(idr === "NaN" ? "0" : idr);
                                        const idrPriceValue =
                                            thisFee * currentPrice;
                                        setReceiveValue(
                                            parseFloat(
                                                (
                                                    parseFloat(idr) +
                                                    idrPriceValue
                                                ).toFixed(5)
                                            )
                                        );
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-y-2">
                            <p className="text-cute">
                                Liquidity:&nbsp;
                                {`${
                                    currentSelectedToken?.native
                                        ? parseFloat(
                                              nativeBalance?.data?.formatted ??
                                                  "0"
                                          ).toFixed(5)
                                        : parseFloat(
                                              tokenBalance?.data?.formatted ??
                                                  "0"
                                          ).toFixed(5)
                                }`}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (loading || isCheckingBankAccount)
                                        return;
                                    setTokenModal(true);
                                }}
                                className="skt-w text-white skt-w-input skt-w-button flex items-center justify-between flex-shrink-0 w-auto p-0 hover:bg-transparent bg-transparent"
                            >
                                <span className="flex items-center">
                                    <div className="relative flex h-fit w-fit">
                                        <div className="skt-w h-6 w-6 rounded-full overflow-hidden">
                                            <img
                                                src={
                                                    currentSelectedToken?.imgUrl ??
                                                    ""
                                                }
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
                        </div>
                    </div>
                    <button
                        disabled={
                            loading ||
                            isCheckingBankAccount ||
                            liquidityUnavailable
                        }
                        onClick={async (e) => {
                            e.preventDefault();
                            coingeckoMutate();
                            try {
                                if (!signed.signed) {
                                    dispatch(signActions.setIsSigning(true));
                                    signMessage({
                                        message:
                                            "By signing this, you have agreed to Seamless Finance's terms and conditions",
                                    });
                                    dispatch(signActions.setSign(true));
                                    return;
                                }

                                if (
                                    cryptoValue === "0" ||
                                    parseFloat(cryptoValue) === 0
                                ) {
                                    Swal.fire(
                                        "Not done!",
                                        "Please fill crypto value!",
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
                                if (coingeckoError) {
                                    return Swal.fire(
                                        "Internal Error!",
                                        "Internal error, please contact admin",
                                        "error"
                                    );
                                }
                                if (!selectedWalletAddress) {
                                    return Swal.fire(
                                        "Not done!",
                                        "Please fill in the wallet address to send the crypto to!",
                                        "warning"
                                    );
                                }
                                if (
                                    cryptoValue === "0" ||
                                    parseFloat(cryptoValue) === 0
                                ) {
                                    Swal.fire(
                                        "Not done!",
                                        "Please fill crypto value!",
                                        "warning"
                                    );
                                    return;
                                }
                                if (liquidityUnavailable) {
                                    return Swal.fire(
                                        "Liquidity Unavailable!",
                                        "Please fill crypto value that's less than the liquidity!",
                                        "warning"
                                    );
                                }
                                Swal.fire({
                                    title: "Confirm Send",
                                    text: `You are about to pay ${parseInt(
                                        idrValue
                                    )} IDR to receive ${cryptoValue} ${
                                        currentSelectedToken?.name
                                    } to 
                  ${selectedWalletAddress}
                  Please confirm.`,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, confirm!",
                                    reverseButtons: true,
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        const getBankAccount =
                                            await axiosSecondary.post(
                                                "/create-payment",
                                                {
                                                    title: "Seamless",
                                                    type: "SINGLE",
                                                    amount: parseInt(idrValue),
                                                    redirect_url:
                                                        "https://app.seamless.finance/transactions",
                                                }
                                            );

                                        const res = await axiosApi.post(
                                            `/api/offramp-transactions`,
                                            {
                                                data: {
                                                    crypto_value: parseFloat(
                                                        cryptoValue ?? "0"
                                                    ),
                                                    chain_id:
                                                        currentSelectedNetwork?.chainId,
                                                    crypto: currentSelectedToken?.name,
                                                    idr_value: parseFloat(
                                                        idrValue ?? "0"
                                                    ),
                                                    link_id:
                                                        getBankAccount.data
                                                            .link_id,
                                                    crypto_fee: parseFloat(
                                                        exchangeFee ?? "0"
                                                    ),
                                                    chain_name:
                                                        currentSelectedNetwork?.name,
                                                    status: "Pending",
                                                    to_address:
                                                        selectedWalletAddress ??
                                                        "",
                                                },
                                            }
                                        );
                                        console.log(res, "<<< RES!!");
                                        window.open(
                                            "https://" +
                                                getBankAccount.data.link_url
                                        );
                                    }
                                });
                            } catch (e: any) {
                                console.log(
                                    e?.message.includes("rejected signing")
                                );
                                setLoading(false);
                            }
                        }}
                        className={`mt-5 rounded-[12px] text-white font-bold ${
                            loading
                                ? "bg-darkGray cursor-not-allowed"
                                : !signed.signed
                                ? "bg-btn"
                                : insufficientDisburse ||
                                  receiveValueError ||
                                  liquidityUnavailable
                                ? "bg-red/30 cursor-not-allowed"
                                : "bg-btn"
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
                        ) : !signed.signed ? (
                            "Sign"
                        ) : receiveValueError ? (
                            "Min send value is 10,000 IDR"
                        ) : insufficientDisburse ? (
                            "Disbursement unavailable"
                        ) : liquidityUnavailable ? (
                            "Liquidity Unavailable"
                        ) : (
                            "Transfer to Bank"
                        )}
                    </button>
                </div>
            </div>
            <SelectBuyNetworkModal
                networkModal={networkModal}
                setNetworkModal={setNetworkModal}
                setCurrentNetwork={setCurrentSelectedNetwork}
            />
            <CustomModal
                tokenModal={tokenModal}
                setTokenModal={setTokenModal}
                currentChain={currentSelectedNetwork}
                setCurrentSelectedToken={setCurrentSelectedToken}
                currentSelectedToken={currentSelectedToken}
                resetCurrency={resetCurrency}
                buyComponent
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
                banksList={banksData}
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
            {/* ASDF */}
            {/* <ReferralModal referralModal={!referral.isValid} /> */}
        </div>
    );
};
