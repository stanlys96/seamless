import { chainData, supportedChains } from "@/utils/helper";
import { useEthers } from "@usedapp/core";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { useState } from "react";
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from "react-icons/io";

interface Props {
  setDropdownActive: (param1: any) => void;
  dropdownActive: boolean;
}

export const SwitchNetwork = ({ setDropdownActive, dropdownActive }: Props) => {
  const theme = useSelector((state: RootState) => state.theme);
  const { chainId, switchNetwork } = useEthers();
  const chainSupported = supportedChains.includes(chainId ?? 0);
  const [showTestNetwork, setShowTestNetwork] = useState(false);
  const resultData = showTestNetwork
    ? chainData
    : chainData.filter((data: any) => !data.testNetwork);
  return (
    <div className="relative z-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          setDropdownActive((prevValue: any) => !prevValue);
        }}
        className={`h-9 rounded ${
          chainSupported ? "bg-[#262636]" : "bg-pink"
        } px-2 font-semibold ${
          theme.theme === "light" ? "bg-button-light" : ""
        } sm:h-[48px] sm:text-lg flex gap-x-1 items-center`}
      >
        {chainSupported ? (
          <div>
            <div className="z-100 text-socket-tag-green-text absolute bottom-1 right-1 items-center justify-center rounded-full bg-white pt-[0.5px] sm:bottom-1.5 sm:right-0.5 sm:h-4 sm:w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#000000"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-2.5 w-2.5 text-inherit sm:h-4 sm:w-4"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <img
              className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
              src={chainData.find((data) => data.chainId === chainId)?.imgUrl}
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
        className={`absolute dropdown-top right-0 top-14 w-[240px] rounded-lg border border-gray transition ${
          theme.theme === "light" ? "bg-button-light" : "bg-button-dark"
        } p-3 ${dropdownActive ? "block" : "hidden"}`}
      >
        {resultData.map((data, idx) => (
          <button
            key={idx}
            onClick={async (e) => {
              e.preventDefault();
              setDropdownActive(false);
              await switchNetwork(data.chainId);
            }}
            className={`${
              chainId === data.chainId
                ? `${theme.theme === "dark" ? "bg-mainGray" : "bg-white"}`
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
        <button
          onClick={async (e) => {
            e.preventDefault();
            setShowTestNetwork((prevState) => !prevState);
          }}
          className={`${
            theme.theme === "dark" ? `hover:bg-mainGray2` : "hover:bg-gray"
          } flex w-full items-center justify-between rounded p-2 text-sm font-medium transition`}
        >
          <div className="flex items-center">
            <div
              className={`skt-w flex justify-center items-center rounded-full overflow-hidden mr-2 w-6 h-6 transition  ${
                theme.theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {!showTestNetwork ? (
                <IoIosRadioButtonOff />
              ) : (
                <IoIosRadioButtonOn />
              )}
            </div>
            Show Test Network
          </div>
        </button>
      </div>
    </div>
  );
};
