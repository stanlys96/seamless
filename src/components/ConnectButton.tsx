import { useEthers, useEtherBalance, useSigner } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { chainData, supportedChains } from "@/utils/helper";
import { useEffect, useState } from "react";
import { SwitchNetwork } from "./SwitchNetwork";
import { useSelector } from "react-redux";
import { RootState } from "../stores";

export const ConnectButton = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const {
    account,
    deactivate,
    activateBrowserWallet,
    chainId,
    switchNetwork,
    isLoading,
    library,
  } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [dropdownActive, setDropdownActive] = useState(false);
  const chainSupported = supportedChains.includes(chainId ?? 0);
  const signer = useSigner();
  const currentNative = chainData
    .find((data) => data.chainId === chainId)
    ?.tokenData.find((data) => data.native);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (account) {
    }
  }, [account]);

  if (!chainSupported && !isLoading)
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
  else if (account)
    return (
      <div
        className={`${
          theme.theme === "light" ? "text-dark" : "text-light"
        } transition duration-500 flex gap-x-2`}
      >
        <button
          onClick={() => {
            deactivate();
          }}
          className={`h-9 rounded ${
            theme.theme === "light" ? "bg-button-light" : "bg-[#262636]"
          } ] px-4 font-semibold ${
            theme.theme === "light" ? "text-dark" : "text-light"
          } sm:h-[48px] transition duration-500  sm:text-lg`}
        >
          {`${formatEther(etherBalance ?? "0x0").slice(0, 8)} ${
            currentNative?.name
          } ${
            windowWidth > 768
              ? account.slice(0, 5) + "..." + account.slice(account.length - 4)
              : ""
          }`}
        </button>
        <SwitchNetwork
          setDropdownActive={setDropdownActive}
          dropdownActive={dropdownActive}
        />
      </div>
    );
  else
    return (
      <button
        className="h-9 rounded bg-[#262636] px-4 font-semibold text-white sm:h-[48px] sm:text-lg"
        onClick={async () => {
          activateBrowserWallet();
        }}
      >
        Connect
      </button>
    );
};
