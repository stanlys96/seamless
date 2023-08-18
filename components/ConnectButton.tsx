import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { chainData, supportedChains } from "@/utils/helper";
import { useEffect, useState } from "react";
import { SwitchNetwork } from "./SwitchNetwork";

export const ConnectButton = () => {
  const {
    account,
    deactivate,
    activateBrowserWallet,
    chainId,
    switchNetwork,
    isLoading,
  } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [dropdownActive, setDropdownActive] = useState(false);
  const chainSupported = supportedChains.includes(chainId ?? 0);
  const currentNative = chainData
    .find((data) => data.chainId === chainId)
    ?.tokenData.find((data) => data.native);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

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
      <div className="flex gap-x-2">
        <button className="h-9 rounded bg-[#262636] px-4 font-semibold text-white sm:h-[48px] sm:text-lg">
          {`${formatEther(etherBalance ?? "0x0").slice(0, 8)} ${
            currentNative?.name
          } ${windowWidth > 768 ? account.slice(0, 15) + "..." : ""}`}
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
        onClick={() => {
          console.log("???");
          activateBrowserWallet();
        }}
      >
        Connect
      </button>
    );
};
