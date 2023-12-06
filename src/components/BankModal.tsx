import {
  bankTypes,
  donationData,
  eWallets,
  existBankData,
  virtualAccounts,
} from "@/utils/helper";
import { useState, useEffect } from "react";

interface Props {
  bankModal: any;
  setBankModal: (param1: any) => void;
  setCurrentSelectedBank: (param1: any) => void;
  currentSelectedBank: any;
  setBankAccountName?: (param1: any) => void;
  setBankAccountValue?: (param1: any) => void;
  banksList?: any;
  setPhoneNumber?: (param1: any) => void;
  hideDonation?: boolean;
}

export const BankModal = ({
  bankModal,
  setBankModal,
  setCurrentSelectedBank,
  currentSelectedBank,
  setBankAccountName,
  banksList,
  setBankAccountValue,
  setPhoneNumber,
  hideDonation,
}: Props) => {
  const [theList, setTheList] = useState(banksList?.data ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "bank" | "e-wallet" | "va" | "donation"
  >("bank");
  useEffect(() => {
    setTheList(banksList?.data ?? []);
  }, [banksList]);

  const filterBank = (bankData: any) => {
    return (
      bankData.status.toLowerCase() === "operational" &&
      bankData.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterCategory = (bankData: any) => {
    if (searchQuery) return bankData.status.toLowerCase() === "operational";
    if (selectedCategory === "bank") {
      return (
        !eWallets.includes(bankData.bank_code) &&
        bankData.status.toLowerCase() === "operational"
      );
    } else if (selectedCategory === "e-wallet") {
      return (
        eWallets.includes(bankData.bank_code) &&
        bankData.status.toLowerCase() === "operational"
      );
    } else if (selectedCategory === "va") {
      return (
        virtualAccounts.includes(bankData.bank_code) &&
        bankData.status.toLowerCase() === "operational"
      );
    }
  };

  const filterBankType = (bankType: any) => {
    if (hideDonation) {
      return bankType.name !== "Donation";
    }
    return bankType;
  };

  const listResult = theList.filter(filterBank).filter(filterCategory);
  return (
    <div className={`${bankModal ? "block" : "hidden"}`}>
      <div
        className="z-50 bg-[#828282]/50 dark:bg-[#101016CC] backdrop-blur-sm w-full sm:p-5 md:p-10 fixed top-0 left-0 items-center justify-center flex h-full"
        style={{ opacity: 1 }}
      >
        <div className="flex flex-col rounded-xl bg-theGray sm:overflow-clip border border-gray sm:w-[520px] sm:rounded-b-xl static bottom-0 w-full h-fit">
          <div className="relative flex flex-shrink-0 items-center justify-between border-b border-gray py-2.5 px-6 sm:py-4 sm:px-6">
            <h3 className="text-lg font-medium text-socket-primary">
              Select Bank
            </h3>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setBankModal(false);
                  setSelectedCategory("bank");
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
                    placeholder="Search by name"
                    spellCheck="false"
                    value={searchQuery}
                  />
                </div>
                <div className={`${!searchQuery ? "block" : "hidden"}`}>
                  <div className="noScrollbar flex overflow-x-auto sm:flex-wrap items-center mt-4">
                    {bankTypes
                      .filter(filterBankType)
                      .map((bank: any, idx: any) => (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory(bank.name.toLowerCase());
                          }}
                          key={bank.id}
                          className={`m-1 transition duration-500  flex min-w-fit items-center rounded-full border py-1 pl-1.5 pr-2  disabled:opacity-40 disabled:hover:bg-transparent sm:px-2 border border-gray ${
                            selectedCategory.toLowerCase() ===
                            bank.name.toLowerCase()
                              ? "bg-layer3 hover:border-layer3"
                              : "hover:border-transparent hover:bg-mainGray2"
                          }`}
                        >
                          <img
                            className="skt-w bg-white rounded-full overflow-hidden h-6 w-6 mr-1.5"
                            src={bank.imgUrl}
                            width="100%"
                            height="100%"
                          />
                          <span className="pt-px font-medium text-socket-primary sm:text-lg">
                            {bank.name}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 h-[500px] max-h-[60vh] border-t border-gray">
            {selectedCategory !== "donation" &&
              (listResult.length > 0 ? (
                listResult.map((bankData: any, idx: number) => (
                  <button
                    key={bankData.code}
                    onClick={(e) => {
                      e.preventDefault();
                      e.preventDefault();
                      setCurrentSelectedBank({
                        name: bankData.name,
                        bank_code: bankData.bank_code,
                        imgUrl: existBankData.includes(bankData.bank_code)
                          ? `/img/banks/${bankData.bank_code}.png`
                          : "/img/banks/bank.png",
                      });
                      if (
                        currentSelectedBank.bank_code !== bankData.bank_code
                      ) {
                        setBankAccountName && setBankAccountName("");
                        setBankAccountValue && setBankAccountValue("");
                        setSelectedCategory("bank");
                        setPhoneNumber && setPhoneNumber("");
                      }
                      setBankModal(false);
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
                              existBankData.includes(bankData.bank_code)
                                ? `/img/banks/${bankData.bank_code}.png`
                                : "/img/banks/bank.png"
                            }
                            width="100%"
                            height="100%"
                            alt="Bank"
                          />
                        </div>
                        <div className="text-left">
                          <p className="flex items-center font-semibold text-socket-primary">
                            <span>{bankData.name}</span>
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
              ))}
            {selectedCategory === "donation" &&
              donationData.map((theData: any, idx: number) => (
                <button
                  key={theData.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentSelectedBank({
                      name: banksList.data.find(
                        (bank: any) => bank.bank_code === theData.bank_code
                      ).name,
                      bank_code: theData.bank_code,
                      imgUrl: existBankData.includes(theData.bank_code)
                        ? `/img/banks/${theData.bank_code}.png`
                        : "/img/banks/bank.png",
                    });
                    setBankAccountName &&
                      setBankAccountName(theData.bank_account_name);
                    setBankAccountValue &&
                      setBankAccountValue(theData.bank_account_number);
                    setBankModal(false);
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
                            existBankData.includes(theData.bank_code)
                              ? `/img/banks/${theData.bank_code}.png`
                              : "/img/banks/bank.png"
                          }
                          width="100%"
                          height="100%"
                          alt="Bank"
                        />
                      </div>
                      <div className="text-left">
                        <p className="flex items-center font-semibold text-socket-primary">
                          <span>{theData.bank_account_name}</span>
                        </p>
                        <p className="flex items-center font-semibold text-socket-primary">
                          <span>{theData.bank_account_number}</span>
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center font-medium text-socket-secondary"></span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
