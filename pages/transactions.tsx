"use client";
import { MainLayout } from "@/layouts/Main";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { allTokenData, chainData } from "@/utils/helper";
import { useRouter } from "next/router";

function sortById(a: any, b: any) {
  return a.id - b.id;
}

export default function TransactionPage() {
  const router = useRouter();
  const { account } = useEthers();
  const [userTransactions, setUserTransactions] = useState<any>([]);
  const { data: transactionsData } = useSWR(
    "/api/transaction-histories",
    fetcherStrapi
  );

  useEffect(() => {
    if (
      transactionsData &&
      transactionsData.data &&
      transactionsData.data.data.length > 0
    ) {
      const transactionsResult = transactionsData.data.data;
      setUserTransactions(
        transactionsResult.filter(
          (transaction: any) =>
            transaction.attributes.wallet_address.toLowerCase() ===
            account?.toLowerCase()
        )
      );
    }
  }, [transactionsData, account]);
  return (
    <MainLayout>
      {userTransactions.length > 0 ? (
        <div>
          <div className="pt-[15vh] px-[20px] md:px-[100px] font-bold text-xl">
            Transactions
          </div>
          <div className="overflow-clip mt-5 px-[20px] md:px-[100px] rounded-lg border-none border-socket-primary sm:border">
            <div className="sm:overflow-x-auto">
              <div className="hidden w-max min-w-full border-b border-socket-primary bg-socket-layers-1 py-3.5 pl-8 pr-5 font-medium capitalize text-socket-primary sm:overflow-x-auto lg:flex">
                <div className="mr-10 min-w-[350px] flex-[1.3] flex-shrink-0 pr-8 lg:pr-4">
                  Transaction status
                </div>
                <div className="min-w-[330px] flex-1 flex-shrink-0">Source</div>
                <div className="min-w-[330px] flex-1 flex-shrink-0">
                  Destination
                </div>
              </div>
              {userTransactions
                .sort(sortById)
                .map((userData: any, idx: any) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:grid-cols-1 lg:gap-0"
                  >
                    <button className="mb-2 hidden w-max min-w-full justify-between rounded border border-socket-primary bg-socket-layers-1 px-2 py-3 text-left hover:bg-socket-layers-2 disabled:hover:bg-socket-layers-1 sm:mb-0 sm:rounded-none sm:border-b sm:py-4 sm:pl-8 sm:pr-5 sm:last:border-0 lg:flex">
                      <div className="mr-10 flex min-w-[350px] flex-[1.3] flex-shrink-0 items-center pr-8 lg:pr-4">
                        <div>
                          <span className="flex items-center text-xl font-semibold capitalize text-socket-primary">
                            Transfer
                          </span>
                          <div className="flex items-center whitespace-nowrap font-medium text-socket-success">
                            <div className="mr-[7px]">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.2807 6.85743L13.6914 6.2481C13.2627 5.80477 13.0621 5.1881 13.1487 4.57744L13.2674 3.7381C13.3194 3.3701 13.0701 3.02744 12.7041 2.96277L11.8694 2.8161C11.2621 2.70943 10.7374 2.32877 10.4481 1.78344L10.0507 1.03477C9.87672 0.708102 9.47339 0.576769 9.14006 0.740102L8.37872 1.1121C7.82472 1.38277 7.17606 1.38277 6.62206 1.1121L5.86006 0.740102C5.52672 0.576769 5.12339 0.708102 4.94939 1.0361L4.55206 1.78477C4.26272 2.3301 3.73872 2.71077 3.13072 2.81744L2.29606 2.9641C1.93006 3.0281 1.68072 3.37077 1.73272 3.73877L1.85139 4.5781C1.93806 5.18877 1.73739 5.80543 1.30872 6.24877L0.719391 6.8581C0.460724 7.12543 0.460724 7.54877 0.719391 7.8161L1.30872 8.42544C1.73739 8.86877 1.93806 9.48543 1.85139 10.0961L1.73272 10.9354C1.68072 11.3034 1.93006 11.6461 2.29606 11.7108L3.13072 11.8574C3.73806 11.9641 4.26272 12.3448 4.55206 12.8901L4.94939 13.6388C5.12339 13.9668 5.52672 14.0981 5.86072 13.9348L6.62206 13.5628C7.17606 13.2921 7.82472 13.2921 8.37872 13.5628L9.14006 13.9348C9.47406 14.0981 9.87672 13.9668 10.0514 13.6388L10.4487 12.8901C10.7381 12.3454 11.2621 11.9641 11.8701 11.8574L12.7047 11.7108C13.0707 11.6468 13.3201 11.3034 13.2681 10.9354L13.1494 10.0961C13.0627 9.48543 13.2634 8.86877 13.6921 8.42544L14.2814 7.8161C14.5387 7.54877 14.5387 7.12477 14.2807 6.85743ZM6.36206 9.8081L4.83339 8.27943C4.57339 8.01943 4.57339 7.59677 4.83339 7.33677C5.09339 7.07677 5.51606 7.07677 5.77606 7.33677L6.83339 8.3941L9.89072 5.33677C10.1507 5.07677 10.5734 5.07677 10.8334 5.33677C11.0934 5.59677 11.0934 6.01943 10.8334 6.27943L7.30472 9.8081C7.04472 10.0681 6.62206 10.0681 6.36206 9.8081Z"
                                  fill="#32D583"
                                ></path>
                              </svg>
                            </div>
                            Transfer Successful{" "}
                            <span className="pl-1.5 text-socket-primary">
                              - {userData.attributes.updatedAt.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden min-w-[330px] flex-1 flex-shrink-0 sm:block">
                        <div className="mb-1.5 flex items-center">
                          <span className="font-medium text-socket-secondary">
                            Token:
                          </span>
                          <div className="ml-1.5 flex items-center font-semibold text-socket-primary">
                            <div className="skt-w rounded-full overflow-hidden w-5 h-5">
                              <img
                                src={
                                  allTokenData.find(
                                    (data) =>
                                      data.name === userData.attributes.token
                                  )?.imgUrl
                                }
                                width="100%"
                                height="100%"
                              />
                            </div>
                            <span className="pl-1">
                              <span className="flex flex-nowrap items-center whitespace-nowrap">
                                {userData.attributes.token_value}{" "}
                                {userData.attributes.token}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-socket-secondary">
                            Chain:
                          </span>
                          <div className="ml-1.5 flex items-center font-semibold text-socket-primary">
                            <div className="skt-w rounded-full overflow-hidden w-5 h-5">
                              <img
                                src={
                                  chainData.find(
                                    (data) =>
                                      data.chainId.toString() ===
                                      userData.attributes.chain.toString()
                                  )?.imgUrl
                                }
                                width="100%"
                                height="100%"
                              />
                            </div>
                            <span className="pl-1">
                              {
                                chainData.find(
                                  (data) =>
                                    data.chainId.toString() ===
                                    userData.attributes.chain.toString()
                                )?.name
                              }
                            </span>
                          </div>
                          <a
                            href={`https://goerli.etherscan.io/tx/${userData.attributes.transaction_hash}`}
                            target="_blank"
                          >
                            <span className="flex ml-1">
                              <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.8203 2.48368C13.7955 2.48446 13.7707 2.48663 13.7461 2.49019H10.5C10.4117 2.48894 10.3239 2.50526 10.242 2.5382C10.16 2.57114 10.0854 2.62005 10.0225 2.68208C9.95955 2.74411 9.90959 2.81802 9.8755 2.89953C9.8414 2.98103 9.82384 3.0685 9.82384 3.15685C9.82384 3.2452 9.8414 3.33267 9.8755 3.41418C9.90959 3.49568 9.95955 3.5696 10.0225 3.63163C10.0854 3.69366 10.16 3.74256 10.242 3.77551C10.3239 3.80845 10.4117 3.82477 10.5 3.82352H12.224L6.02865 10.0188C5.96466 10.0803 5.91358 10.1538 5.87839 10.2353C5.8432 10.3167 5.82461 10.4043 5.82371 10.493C5.82281 10.5817 5.83961 10.6697 5.87314 10.7518C5.90666 10.8339 5.95624 10.9085 6.01896 10.9712C6.08167 11.0339 6.15628 11.0835 6.2384 11.1171C6.32051 11.1506 6.4085 11.1674 6.49719 11.1665C6.58588 11.1656 6.67351 11.147 6.75493 11.1118C6.83634 11.0766 6.90992 11.0255 6.97135 10.9615L13.1667 4.76623V6.49019C13.1654 6.57853 13.1817 6.66624 13.2147 6.74822C13.2476 6.83019 13.2965 6.90481 13.3586 6.96772C13.4206 7.03063 13.4945 7.08059 13.576 7.11469C13.6575 7.14879 13.745 7.16635 13.8333 7.16635C13.9217 7.16635 14.0092 7.14879 14.0907 7.11469C14.1722 7.08059 14.2461 7.03063 14.3081 6.96772C14.3701 6.90481 14.419 6.83019 14.452 6.74822C14.4849 6.66624 14.5012 6.57853 14.5 6.49019V3.24149C14.5133 3.14551 14.5055 3.04778 14.4771 2.95512C14.4488 2.86246 14.4006 2.77709 14.3359 2.70496C14.2712 2.63283 14.1916 2.57566 14.1025 2.53744C14.0135 2.49923 13.9172 2.48088 13.8203 2.48368ZM3.83333 2.49019C3.10462 2.49019 2.5 3.09481 2.5 3.82352V13.1569C2.5 13.8856 3.10462 14.4902 3.83333 14.4902H13.1667C13.8954 14.4902 14.5 13.8856 14.5 13.1569V9.15685C14.5012 9.06851 14.4849 8.9808 14.452 8.89882C14.419 8.81685 14.3701 8.74223 14.3081 8.67932C14.2461 8.61641 14.1722 8.56645 14.0907 8.53235C14.0092 8.49825 13.9217 8.48069 13.8333 8.48069C13.745 8.48069 13.6575 8.49825 13.576 8.53235C13.4945 8.56645 13.4206 8.61641 13.3586 8.67932C13.2965 8.74223 13.2476 8.81685 13.2147 8.89882C13.1817 8.9808 13.1654 9.06851 13.1667 9.15685V13.1569H3.83333V3.82352H7.83333C7.92167 3.82477 8.00938 3.80845 8.09136 3.77551C8.17334 3.74256 8.24795 3.69366 8.31087 3.63163C8.37378 3.5696 8.42374 3.49568 8.45784 3.41418C8.49193 3.33267 8.50949 3.2452 8.50949 3.15685C8.50949 3.0685 8.49193 2.98103 8.45784 2.89953C8.42374 2.81802 8.37378 2.74411 8.31087 2.68208C8.24795 2.62005 8.17334 2.57114 8.09136 2.5382C8.00938 2.50526 7.92167 2.48894 7.83333 2.49019H3.83333Z"
                                  fill="#F9FAFB"
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="hidden min-w-[330px] flex-1 flex-shrink-0 sm:block">
                        <div className="mb-1.5 flex items-center">
                          <span className="font-medium text-socket-secondary">
                            Value:
                          </span>
                          <div className="ml-1.5 flex items-center font-semibold text-socket-primary">
                            <img
                              className="skt-w rounded-full overflow-hidden w-5 h-5"
                              src="/img/indo2.png"
                              width="100%"
                              height="100%"
                            />
                            <span className="pl-1">
                              <span className="flex flex-nowrap items-center whitespace-nowrap">
                                {userData.attributes.idr_value} IDR
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-socket-secondary">
                            Bank:
                          </span>
                          <div className="ml-1.5 flex items-center font-semibold text-socket-primary">
                            <img
                              className="skt-w rounded-full overflow-hidden w-5 h-5"
                              src="/img/bca.png"
                              width="100%"
                              height="100%"
                            />
                            <span className="pl-1">
                              {userData.attributes.bank_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="font-medium text-socket-secondary">
                            Account Number:
                          </span>
                          <div className="ml-1.5 flex items-center font-semibold text-socket-primary">
                            <span className="pl-1">
                              {userData.attributes.bank_account_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <button className="transition duration-400 mb-2 flex w-max min-w-full items-center justify-between rounded border border-socket-primary px-2 py-3 text-left hover:bg-socket-layers-2 sm:mb-0 lg:hidden">
                      <div className="flex items-center justify-between">
                        <div className="relative mr-2 h-9 w-9 rounded-full">
                          <img
                            src="https://movricons.s3.ap-south-1.amazonaws.com/refuel.png"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div>
                          <span className="flex items-center font-semibold capitalize text-socket-primary">
                            Transfer
                            <div className="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                            <span className="flex items-center text-sm font-medium text-socket-success">
                              <div className="mr-[7px]">
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.2807 6.85743L13.6914 6.2481C13.2627 5.80477 13.0621 5.1881 13.1487 4.57744L13.2674 3.7381C13.3194 3.3701 13.0701 3.02744 12.7041 2.96277L11.8694 2.8161C11.2621 2.70943 10.7374 2.32877 10.4481 1.78344L10.0507 1.03477C9.87672 0.708102 9.47339 0.576769 9.14006 0.740102L8.37872 1.1121C7.82472 1.38277 7.17606 1.38277 6.62206 1.1121L5.86006 0.740102C5.52672 0.576769 5.12339 0.708102 4.94939 1.0361L4.55206 1.78477C4.26272 2.3301 3.73872 2.71077 3.13072 2.81744L2.29606 2.9641C1.93006 3.0281 1.68072 3.37077 1.73272 3.73877L1.85139 4.5781C1.93806 5.18877 1.73739 5.80543 1.30872 6.24877L0.719391 6.8581C0.460724 7.12543 0.460724 7.54877 0.719391 7.8161L1.30872 8.42544C1.73739 8.86877 1.93806 9.48543 1.85139 10.0961L1.73272 10.9354C1.68072 11.3034 1.93006 11.6461 2.29606 11.7108L3.13072 11.8574C3.73806 11.9641 4.26272 12.3448 4.55206 12.8901L4.94939 13.6388C5.12339 13.9668 5.52672 14.0981 5.86072 13.9348L6.62206 13.5628C7.17606 13.2921 7.82472 13.2921 8.37872 13.5628L9.14006 13.9348C9.47406 14.0981 9.87672 13.9668 10.0514 13.6388L10.4487 12.8901C10.7381 12.3454 11.2621 11.9641 11.8701 11.8574L12.7047 11.7108C13.0707 11.6468 13.3201 11.3034 13.2681 10.9354L13.1494 10.0961C13.0627 9.48543 13.2634 8.86877 13.6921 8.42544L14.2814 7.8161C14.5387 7.54877 14.5387 7.12477 14.2807 6.85743ZM6.36206 9.8081L4.83339 8.27943C4.57339 8.01943 4.57339 7.59677 4.83339 7.33677C5.09339 7.07677 5.51606 7.07677 5.77606 7.33677L6.83339 8.3941L9.89072 5.33677C10.1507 5.07677 10.5734 5.07677 10.8334 5.33677C11.0934 5.59677 11.0934 6.01943 10.8334 6.27943L7.30472 9.8081C7.04472 10.0681 6.62206 10.0681 6.36206 9.8081Z"
                                    fill="#32D583"
                                  ></path>
                                </svg>
                              </div>
                              Success
                            </span>
                          </span>
                          <div className="items-center whitespace-nowrap text-sm font-medium text-socket-secondary">
                            <span>
                              {" "}
                              {userData.attributes.token_value}{" "}
                              {userData.attributes.token}
                            </span>
                            <span className="px-2">-</span>
                            <span>{userData.attributes.idr_value} IDR</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center justify-self-end rounded-full bg-socket-layers-3 pl-px text-socket-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="h-5 w-5"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative pt-[100px] flex flex-col items-center lg:justify-center">
          <img src="/img/no-data.svg" className="mb-7 w-[200px] lg:w-[350px]" />
          <h1 className="text-center text-lg font-semibold text-socket-primary lg:text-2xl">
            No Transactions
          </h1>
          <p className="my-2 max-w-[460px] text-center text-socket-secondary lg:text-lg">
            You haven&apos;t made any transaction yet. Tap on the button to
            start transaction
          </p>
          <a
            className="mt-4 cursor-pointer flex items-center rounded px-8 py-4 font-medium text-socket-btn-primary bg-pink hover:bg-socket-btn-primary-hover"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            Start Transaction{" "}
          </a>
        </div>
      )}
    </MainLayout>
  );
}
