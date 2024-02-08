import { chainData, supportedChains } from "@/utils/helper";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { useState } from "react";
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from "react-icons/io";
import { useNetwork } from "wagmi";
import { switchNetwork } from "@wagmi/core";
import Image from "next/image";

interface Props {
  setDropdownActive: (param1: any) => void;
  dropdownActive: boolean;
}

export const SwitchNetwork = ({ setDropdownActive, dropdownActive }: Props) => {
  const theme = useSelector((state: RootState) => state.theme);
  const { chain, chains } = useNetwork();
  const chainSupported = supportedChains.includes((chain?.id ?? 0) as any);
  const [showTestNetwork, setShowTestNetwork] = useState(false);
  const resultData = chainData.filter(
    (data: any) => !data.testNetwork && supportedChains.includes(data.chainId)
  );
  return (
    <div className="relative z-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          setDropdownActive((prevValue: any) => !prevValue);
        }}
        className={`rounded-[12px] ${
          chainSupported ? "bg-[#262636]" : "bg-pink"
        } px-2 font-semibold ${
          theme.theme === "light" ? "bg-[#333333]" : ""
        } py-2 sm:text-lg flex gap-x-1 items-center`}
      >
        {chainSupported ? (
          <div className="flex gap-x-2 items-center">
            <Image
              width={24}
              height={24}
              alt="token"
              src={
                chainData.find((data) => data.chainId === chain?.id)?.imgUrl ??
                ""
              }
              className="rounded-full"
            />
            <Image
              src="/img/arrow-down.svg"
              width={24}
              height={24}
              alt="arrow"
            />
          </div>
        ) : (
          <div className="flex items-center gap-x-3">
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
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p>Switch Network</p>
            <AiOutlineArrowDown />
          </div>
        )}
      </button>
      <div
        className={`absolute dropdown-top right-0 top-12 w-[240px] rounded-lg border border-gray transition bg-[#333333] text-white p-3 ${
          dropdownActive ? "block" : "hidden"
        }`}
      >
        {resultData.map((data, idx) => (
          <button
            key={idx}
            onClick={async (e) => {
              e.preventDefault();
              try {
                console.log("???");
                setDropdownActive(false);
                console.log(data.chainId);
                const network = await switchNetwork({
                  chainId: data.chainId,
                });
              } catch (e) {
                console.log(e);
              }
            }}
            className={`${
              chain?.id === data.chainId
                ? `${
                    theme.theme === "dark"
                      ? "bg-mainGray text-black"
                      : "bg-white text-black"
                  }`
                : `${
                    theme.theme === "dark"
                      ? `hover:bg-mainGray2`
                      : "hover:bg-gray"
                  }`
            } flex w-full items-center justify-between rounded p-2 text-sm font-medium transition`}
          >
            <div className="flex items-center">
              <div
                className={`skt-w rounded-full overflow-hidden mr-2 w-6 h-6 transition  ${
                  theme.theme === "light" ? "text-black" : "text-white"
                }`}
              >
                <img src={data.imgUrl} width="100%" height="100%" />
              </div>
              {data.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
