import { chainData, supportedChains } from "@/utils/helper";
import { useEthers } from "@usedapp/core";
import { useConnect } from "wagmi";

interface Props {
  connectModal: any;
  setConnectModal: (param1: any) => void;
}

export const ConnectModal = ({
  connectModal: connectModal,
  setConnectModal: setConnectModal,
}: Props) => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const resultData = chainData.filter((data: any) => !data.testNetwork);
  // const resultData = chainData;
  const { chainId, switchNetwork } = useEthers();
  const chainSupported = supportedChains.includes(chainId ?? 0);
  return (
    <div className={`${connectModal ? "block" : "hidden"}`}>
      <div
        className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm h-full w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex"
        style={{ opacity: 1 }}
      >
        <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] sm:rounded-b-xl static bottom-0 w-full h-fit">
          <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
            <h3 className="text-lg font-medium text-socket-primary text-white">
              Select Connector
            </h3>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConnectModal(false);
                }}
                className="flex h-9 w-9 transition duration-500  items-center justify-center rounded-full bg-mainGray2 hover:bg-layer3 sm:h-10 sm:w-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 cursor-pointer text-socket-primary"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex h-fit flex-col">
              <div className="relative border-gray p-4">
                <div>
                  <div className="noScrollbar gap-4 flex overflow-x-auto flex-wrap">
                    {connectors.map((connector, idx) => (
                      <button
                        key={idx}
                        className="h-9 flex gap-x-2 items-center rounded bg-[#262636] px-4 font-semibold text-white sm:h-[48px] sm:text-lg"
                        onClick={async () => {
                          try {
                            if (isLoading) return;
                            connect({ connector });
                            setConnectModal(false);
                          } catch (e) {
                            console.log(e);
                          }
                        }}
                      >
                        <img
                          className="h-[30px] rounded-full"
                          src={`img/${connector.name}.png`}
                        />
                        <span>
                          {connector.name}
                          {!connector.ready && " (unsupported)"}
                          {isLoading &&
                            connector.id === pendingConnector?.id &&
                            " (connecting)"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
