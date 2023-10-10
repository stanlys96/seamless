import * as React from "react";
import { formatEther } from "@ethersproject/units";
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
} from "wagmi";
import { recoverMessageAddress } from "viem";
import { ConnectModal } from "./ConnectModal";

// export default function ConnectButton() {
//   return ;
// }

export const ConnectButton = () => {
  const recoveredAddress = React.useRef<string>();
  const [domLoaded, setDomLoaded] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
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
  const theme = useSelector((state: RootState) => state.theme);
  const signed = useSelector((state: RootState) => state.sign);
  const dispatch = useDispatch();
  const {
    data: etherData,
    isError: etherIsError,
    isLoading: etherIsLoading,
  } = useBalance({ address });
  const [dropdownActive, setDropdownActive] = useState(false);
  const chainSupported = supportedChains.includes(chain?.id ?? 0);
  const currentNative = chainData
    .find((data) => data.chainId === chain?.id)
    ?.tokenData.find((data) => data.native);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setDomLoaded(true);
  }, []);

  useEffect(() => {
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
        <w3m-button />

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
        <button
          onClick={() => {
            disconnect();
          }}
          className={`h-9 rounded ${
            theme.theme === "light" ? "bg-button-light" : "bg-[#262636]"
          } ] px-4 font-semibold ${
            theme.theme === "light" ? "text-dark" : "text-light"
          } sm:h-[48px] transition duration-500  sm:text-lg`}
        >
          {`${etherData?.formatted.slice(0, 7)} ${currentNative?.name} ${
            windowWidth > 768
              ? address.slice(0, 5) + "..." + address.slice(address.length - 4)
              : ""
          }`}
        </button>
        <SwitchNetwork
          setDropdownActive={setDropdownActive}
          dropdownActive={dropdownActive}
        />
      </div>
    );
};
