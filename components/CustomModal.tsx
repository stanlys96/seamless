interface Props {
  tokenModal: any;
  setTokenModal: (param1: any) => void;
  currentChain: any;
  setCurrentSelectedToken: (param1: any) => void;
  currentSelectedToken: any;
}

export const CustomModal = ({
  tokenModal,
  setTokenModal,
  currentChain,
  setCurrentSelectedToken,
  currentSelectedToken,
}: Props) => {
  return (
    <div className={`${tokenModal ? "block" : "hidden"}`}>
      <div
        className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm h-full w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex"
        style={{ opacity: 1 }}
      >
        <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] rounded-b-none sm:rounded-b-xl absolute sm:static bottom-0 w-full h-fit">
          <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
            <h3 className="text-lg font-medium text-socket-primary">
              Select Token
            </h3>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTokenModal(false);
                }}
                className="flex h-9 w-9 transition duration-400 items-center justify-center rounded-full bg-mainGray2 hover:bg-layer3 sm:h-10 sm:w-10"
              >
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
                  <div className="noScrollbar -mx-2 flex overflow-x-auto sm:flex-wrap">
                    {currentChain?.tokenData &&
                      currentChain?.tokenData.map((token: any, idx: any) => (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentSelectedToken({
                              ...token,
                            });
                            setTokenModal(false);
                          }}
                          key={token.id}
                          className={`m-1 transition duration-400 flex min-w-fit items-center rounded-full border py-1 pl-1.5 pr-2  disabled:opacity-40 disabled:hover:bg-transparent sm:px-2 border border-gray ${
                            currentSelectedToken?.id === token.id
                              ? "bg-layer3 hover:border-layer3"
                              : "hover:border-transparent hover:bg-mainGray2"
                          }`}
                        >
                          <div className="skt-w rounded-full overflow-hidden h-6 w-6 mr-1.5">
                            <img
                              src={token.imgUrl}
                              width="100%"
                              height="100%"
                            />
                          </div>
                          <span className="pt-px font-medium uppercase text-socket-primary sm:text-lg">
                            {token.name}
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
