import * as React from "react";
import { chainData, supportedChains } from "@/utils/helper";
import { useEffect, useState } from "react";
import { SwitchNetwork } from "./SwitchNetwork";
import { useDispatch, useSelector } from "react-redux";
import { RootState, signActions } from "../stores";
import {
  useConnect,
  useAccount,
  useNetwork,
  useDisconnect,
  useSignMessage,
  useBalance,
  useEnsName,
  useEnsAvatar,
} from "wagmi";
import { ConnectModal } from "./ConnectModal";
import Swal from "sweetalert2";
import Image from "next/image";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import { useRouter } from "next/router";

export const ConnectButton = () => {
  const router = useRouter();
  const recoveredAddress = React.useRef<string>();
  const [domLoaded, setDomLoaded] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const {
    connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
    connectAsync,
  } = useConnect();
  const {
    data: signMessageData,
    error: signError,
    isLoading: signIsLoading,
    signMessage,
    variables,
  } = useSignMessage();

  const { chain, chains } = useNetwork();
  const { disconnect } = useDisconnect();
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address,
  });
  const ensAvatar = useEnsAvatar({
    name: ensName,
  });
  const theme = useSelector((state: RootState) => state.theme);
  const signed = useSelector((state: RootState) => state.sign);
  const referral = useSelector((state: RootState) => state.referral);
  const dispatch = useDispatch();
  const {
    data: etherData,
    isError: etherIsError,
    isLoading: etherIsLoading,
  } = useBalance({ address });
  const [dropdownActive, setDropdownActive] = useState(false);
  const [dropdownAccActive, setDropdownAccActive] = useState(false);
  const chainSupported = supportedChains.includes(chain?.id ?? (0 as any));
  const currentNative = chainData
    .find((data) => data.chainId === chain?.id)
    ?.tokenData.find((data) => data.native);

  const [windowWidth, setWindowWidth] = useState(0);
  const { data: pointsData } = useSWR(
    `/api/referral-codes?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );
  const pointsResult = pointsData?.data?.data;

  const accDropdownData = [
    {
      id: 1,
      imgUrl: "/img/setting.svg",
      text: "Account Setting",
      onClick: () => {
        router.push("/settings");
        setDropdownAccActive(false);
      },
    },
    {
      id: 2,
      imgUrl: "/img/switch.svg",
      text: "Switch Wallet",
      onClick: () => {
        disconnect();
        setDropdownAccActive(false);
      },
    },
    {
      id: 3,
      imgUrl: "/img/logout.svg",
      text: "Disconnect",
      onClick: () => {
        disconnect();
        setDropdownAccActive(false);
      },
    },
    {
      id: 4,
      imgUrl: "/img/support-2.svg",
      text: "Support",
      onClick: () => {
        window.open("https://t.me/seamlessfi/2");
        setDropdownAccActive(false);
      },
    },
    {
      id: 5,
      imgUrl: "/img/documentation-2.svg",
      text: "Documentation",
      onClick: () => {
        window.open("https://docs.seamless.finance");
        setDropdownAccActive(false);
      },
    },
  ];

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (referral.free) {
      if (address && !signed.signed && !signed.isSigning) {
        dispatch(signActions.setIsSigning(true));
        setTimeout(() => {
          signMessage({
            message:
              "By signing this, you have agreed to Seamless Finance's terms and conditions",
          });
          dispatch(signActions.setSign(true));
        }, 1500);
      }
    } else {
      console.log(address, "<<<<");
      if (address && !signed.signed && !signed.isSigning) {
        dispatch(signActions.setIsSigning(true));
        setTimeout(() => {
          signMessage({
            message:
              "By signing this, you have agreed to Seamless Finance's terms and conditions",
          });
          dispatch(signActions.setSign(true));
        }, 1500);
      }
    }
  }, [address]);

  if (!domLoaded) return <div></div>;

  if (!address) {
    return (
      <div>
        {/* <button
          className="h-9 rounded bg-[#262636] px-4 font-semibold text-white sm:h-[48px] sm:text-lg"
          onClick={async () => {
            setConnectModal(true);
          }}
        >
          Connect
        </button> */}
        <div className="my-2">
          <w3m-button size="sm" label="Connect&nbsp;Wallet" />
        </div>

        <ConnectModal
          connectModal={connectModal}
          setConnectModal={setConnectModal}
        />
      </div>
    );
  } else if (!chainSupported && !isLoading)
    return (
      <div className="flex gap-x-2">
        <a className="h-9 rounded bg-[#262636] px-4 font-semibold text-white sm:h-[48px] sm:text-lg flex justify-center items-center">
          Chain Not Supported
        </a>
        <SwitchNetwork
          setDropdownActive={setDropdownActive}
          dropdownActive={dropdownActive}
        />
      </div>
    );
  else
    return (
      <div
        className={`${
          theme.theme === "light" ? "text-dark" : "text-light"
        } transition duration-500 flex gap-x-2`}
      >
        <button className="bg-[#333333] font-bold rounded-[12px] flex items-center gap-x-2 sm:text-lg px-4 text-white">
          <Image src="/img/mini-logo.svg" width={24} height={24} alt="logo" />
          <span className="text-gradient-2">
            {pointsResult && pointsResult.length > 0
              ? pointsResult[0].attributes?.points?.toFixed(2) ?? "0"
              : "0"}{" "}
            Pts
          </span>
        </button>
        <button className="bg-[#333333] hidden md:block font-bold rounded-[12px] flex items-center gap-x-1 sm:text-lg px-4 text-white">
          <span className="text-gradient-2">{`${etherData?.formatted.slice(
            0,
            7
          )} ETH`}</span>
        </button>
        <SwitchNetwork
          setDropdownActive={setDropdownActive}
          dropdownActive={dropdownActive}
        />
        <div className="flex items-center relative">
          <button
            onClick={() => {
              setDropdownAccActive((prevState) => !prevState);
            }}
            className={`hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition duration-500 flex items-center h-full gap-x-1 ${
              theme.theme === "light"
                ? `${!dropdownAccActive ? "bg-[#333333]" : "bg-[#1E2021]"}`
                : "bg-[#262636]"
            } px-4 font-semibold transition duration-500 ${
              dropdownAccActive ? "rounded-t-[12px]" : "rounded-[12px]"
            } w-[18vw] sm:text-lg`}
          >
            <span className="text-gradient-2">{`${etherData?.formatted.slice(
              0,
              7
            )} ${currentNative?.name} ${
              !ensName
                ? windowWidth > 768
                  ? address.slice(0, 5) +
                    "..." +
                    address.slice(address.length - 4)
                  : ""
                : ensName
            }`}</span>
            {ensAvatar?.data && (
              <img
                className="w-[30px] h-[30px] hidden md:block rounded-full"
                src={ensAvatar?.data ?? ""}
              />
            )}
          </button>
          <div
            className={`absolute dropdown-top right-0 top-10 w-[18vw] rounded-b-lg transition text-white  ${
              dropdownAccActive ? "block" : "hidden"
            }`}
          >
            {accDropdownData.map((accData: any, index: number) => (
              <button
                key={accData.id}
                onClick={accData.onClick}
                className={`text-white ${
                  index === accDropdownData.length - 1 && "rounded-b-[12px]"
                } p-3 bg-[#1E2021] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] transition duration-500 flex w-full items-center p-2 text-sm font-medium transition`}
              >
                <div className="flex items-center">
                  <div
                    className={`skt-w rounded-full flex-1 overflow-hidden mr-2 w-6 h-6 transition  ${
                      theme.theme === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    <img src={accData.imgUrl} width="100%" height="100%" />
                  </div>
                  <span className="flex-3 font-bold">{accData.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};
