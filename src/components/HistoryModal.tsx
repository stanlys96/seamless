import { existBankData } from "@/utils/helper";
import { useState, useEffect } from "react";

interface Props {
  historyModal: any;
  setHistoryModal: (param1: any) => void;
  setCurrentSelectedBank: (param1: any) => void;
  currentSelectedBank: any;
  setBankAccountName: (param1: any) => void;
  historyList?: any;
  setBankAccountValue: (param1: any) => void;
  setPhoneNumber: (param1: any) => void;
}

export const HistoryModal = ({
  historyModal,
  setHistoryModal,
  setBankAccountName,
  setBankAccountValue,
  setPhoneNumber,
  historyList,
}: Props) => {
  const [theList, setTheList] = useState(historyList?.data?.data ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    setTheList(historyList?.data?.data ?? []);
  }, [historyList]);

  const filterName = (payload: any) => {
    return payload.attributes.bank_account_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  };
  const listResult = theList.filter(filterName);
  return (
    <div className={`${historyModal ? "block" : "hidden"}`}>
      <div
        className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex h-full"
        style={{ opacity: 1 }}
      >
        <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] rounded-xl static bottom-0 w-full h-fit">
          <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
            <h3 className="text-lg font-medium text-socket-primary">
              Select Data
            </h3>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setHistoryModal(false);
                  setSearchQuery("");
                }}
                className="flex h-9 w-9 transition duration-500  items-center justify-center rounded-full bg-mainGray2 hover:bg-layer3 sm:h-10 sm:w-10"
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
            <div className="flex h-fit flex-col justify-center">
              <div className="relative border-gray p-4">
                <div className="flex h-10 items-center rounded-[5px] bg-socket-layers-2 px-4 sm:h-[48px] sm:px-5">
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
                    className="mr-3 h-4 w-4 flex-shrink-0 text-socket-icon-primary sm:h-5 sm:w-5"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    onChange={(e) => {
                      e.preventDefault();
                      setSearchQuery(e.target.value);
                    }}
                    type="string"
                    className="skt-w skt-w-input bg-transparent pt-0.5 focus-visible:outline-none min-w-full text-socket-secondary text-base font-medium w-full"
                    placeholder="Search by account name"
                    spellCheck="false"
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 h-[500px] max-h-[486px] border-t border-gray">
            {listResult.length > 0 ? (
              listResult.map((theData: any, idx: number) => (
                <button
                  key={theData.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setBankAccountName(theData.attributes.bank_account_name);
                    setBankAccountValue(theData.attributes.bank_account_number);
                    setPhoneNumber(theData.attributes.phone_number);
                    setHistoryModal(false);
                    setSearchQuery("");
                  }}
                  className="flex w-full items-center justify-between px-6 py-3 last:border-b-0 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-socket-layers-2"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="skt-w rounded-full overflow-hidden w-9 h-full mr-3">
                        <img
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/img/banks/bank.png";
                          }}
                          src={
                            existBankData.includes(theData.attributes.bank_code)
                              ? `/img/banks/${theData.attributes.bank_code}.png`
                              : "/img/banks/bank.png"
                          }
                          width="100%"
                          height="100%"
                          alt="Bank"
                        />
                      </div>
                      <div className="text-left">
                        <p className="flex items-center font-semibold text-socket-primary">
                          <span>{theData.attributes.bank_account_name}</span>
                        </p>
                        <p className="flex items-center font-semibold text-socket-primary">
                          <span>{theData.attributes.bank_account_number}</span>
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center font-medium text-socket-secondary"></span>
                  </div>
                </button>
              ))
            ) : (
              <p className="px-6 py-3 font-bold text-center">
                Query not found!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
