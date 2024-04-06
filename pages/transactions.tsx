"use client";
import { MainLayout } from "@/src/layouts/Main";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import { allTokenData, chainData, existBankData } from "@/utils/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { Pagination, ConfigProvider, Select, Table } from "antd";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ColumnsType } from "antd/es/table";
import { eWallets } from "@/utils/helper";

export interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  main: boolean;
  username: string;
  token: string;
  token_value: number;
  chain: number;
  idr_value: number;
  bank_name: string;
  bank_account_number: string;
}

function sortById(a: any, b: any) {
  return b.id - a.id;
}

function formatDate(dateString: string) {
  const theDate = new Date(dateString);
  return theDate
    .toLocaleString("id-ID")
    .replaceAll("/", "-")
    .replaceAll(",", "")
    .replaceAll(".", ":")
    .replaceAll(" ", " / ");
}

function sortByLatestId(a: any, b: any) {
  return b.id - a.id;
}

const data = ["Shreyans", "Shrivastava", "shreyansrs@gmail.com"];

export default function TransactionPage() {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "Transaction Status",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value) => (
        <div className="flex gap-x-2">
          <Image width={20} height={20} alt="check" src="/img/check.svg" />
          <div>
            <p>Transfer Successful</p>
            <p>{formatDate(value)}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Source",
      dataIndex: "bank_name",
      key: "bank_name",
      render: (value, record) => (
        <div>
          <div>
            <span className="flex gap-x-1">
              Token :
              <Image
                src={
                  allTokenData.find((data) => data.name === record.token)
                    ?.imgUrl ?? ""
                }
                width={20}
                height={20}
                alt="token"
              />
              &nbsp;
              {record.token_value} {record.token}
            </span>
          </div>
          <div className="mt-2">
            <span className="flex gap-x-1">
              Chain :
              <Image
                className="rounded-full"
                src={
                  chainData.find(
                    (data) =>
                      data.chainId.toString() === record.chain.toString()
                  )?.imgUrl ?? ""
                }
                width={20}
                height={20}
                alt="chain"
              />
              {chainData.find(
                (data) => data.chainId.toString() === record.chain.toString()
              )?.name ?? ""}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Destination",
      dataIndex: "bank_code",
      key: "bank_code",
      render: (value, record) => (
        <div>
          <div>
            <span className="flex gap-x-1">
              Value :
              <Image
                className="rounded-full"
                src="/img/indo2.png"
                width={20}
                height={20}
                alt="token"
              />
              &nbsp;
              {record.idr_value.toLocaleString("en-US")} IDR
            </span>
          </div>
          <div className="mt-2">
            <span className="flex gap-x-1">
              Type :{" "}
              <span className="font-bold">
                {eWallets.includes(record.bank_name.toLowerCase())
                  ? "E-Wallet"
                  : "Bank"}
              </span>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Recipient",
      dataIndex: "bank_account_name",
      key: "bank_account_name",
      render: (value, record) => (
        <div>
          <div>
            <span className="flex gap-x-1">
              Destination : {record.bank_name}
            </span>
          </div>
          <div className="mt-2">
            <span className="flex gap-x-1">
              Account :{" "}
              <span className="font-bold">{record.bank_account_number}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "address",
      key: "address",
      render: (value: any, record: DataType, index: number) => (
        <a className="cursor-pointer">
          <Image width={32} height={32} src="/img/action.svg" alt="action" />
        </a>
      ),
    },
  ];
  const { address, connector, isConnected } = useAccount();
  const scrollToTop = useRef<HTMLInputElement>(null);
  const theme = useSelector((state: RootState) => state.theme);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const [userTransactions, setUserTransactions] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: transactionsData } = useSWR(
    `/api/transaction-histories?sort[0]=id:desc&filters[wallet_address][$eq]=${address}&pagination[page]=${currentPage}&pagination[pageSize]=8`,
    fetcherStrapi
  );

  useEffect(() => {
    if (
      transactionsData &&
      transactionsData.data &&
      transactionsData.data.data.length > 0
    ) {
      const transactionsResult = transactionsData.data.data;
      const temp = [];
      console.log(transactionsResult, "<< !!");
      if (transactionsResult) {
        for (let transactionData of transactionsResult) {
          temp.push({
            id: transactionData.id,
            bank_account_name: transactionData.attributes.bank_account_name,
            bank_name: transactionData.attributes.bank_name,
            bank_code: transactionData.attributes.bank_code,
            updated_at: transactionData.attributes.updatedAt,
            token: transactionData.attributes.token,
            token_value: transactionData.attributes.token_value,
            chain: transactionData.attributes.chain,
            idr_value: transactionData.attributes.idr_value,
            bank_account_number: transactionData.attributes.bank_account_number,
          });
        }
        setUserTransactions(temp);
      }
    }
    if (transactionsData?.data.data.length < 1) {
      setUserTransactions([]);
    }
    setPageLoading(false);
  }, [transactionsData]);
  return (
    <MainLayout>
      <div className="px-[50px] py-[25px]" ref={scrollToTop}>
        <p className="text-[32px] font-bold text-white">Transaction History</p>
        <div className="flex flex-col md:flex-row justify-between mt-4">
          <div className="relative w-[260px]">
            <Image
              src={`/img/filter.svg`}
              width={20}
              height={20}
              alt="logo"
              className="absolute left-2 z-1 bottom-[10px]"
            />
            <Image
              src="/img/arrow-down.svg"
              width={18}
              height={17}
              alt="arrow"
              className="absolute right-2 z-1 bottom-[10px]"
            />
            <select
              placeholder="History Type"
              className="flex-1 pl-[40px] z-50 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            >
              <option>History Type</option>
              <option>Walao</option>
              <option>Walao</option>
            </select>
          </div>
          <div className="relative w-[260px]">
            <Image
              src={`/img/time.svg`}
              width={20}
              height={20}
              alt="logo"
              className="absolute left-2 z-1 bottom-[10px]"
            />
            <Image
              src="/img/arrow-down.svg"
              width={18}
              height={17}
              alt="arrow"
              className="absolute right-2 z-1 bottom-[10px]"
            />
            <select
              placeholder="Select Time"
              className="flex-1 pl-[40px] z-50 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            >
              <option>Select Time</option>
              <option>Walao</option>
              <option>Walao</option>
            </select>
          </div>
        </div>
        {userTransactions.length > 0 ? (
          <div className="flex flex-col justify-center w-full hidden md:block">
            <Table
              className="mt-[40px] w-full"
              dataSource={userTransactions}
              columns={columns}
              rowClassName="bg-[#21222D] transaction text-[#B3B3B3]"
              pagination={false}
            />
            <div className="w-full p-[20px] bg-[#21222D] rounded-b-[10px] flex justify-center items-center">
              <Pagination
                showSizeChanger={false}
                defaultCurrent={1}
                className="text-white"
                style={{
                  color: "white",
                }}
                prevIcon={
                  <div className="flex items-center h-full gap-x-2 bg-white rounded-[8px] px-[15px] py-2">
                    <Image
                      width={20}
                      height={20}
                      src="/img/arrow-left.svg"
                      alt="arrow"
                    />
                    <p className="text-[#344054]">Previous</p>
                  </div>
                }
                nextIcon={
                  <div className="flex items-center h-full gap-x-2 bg-white rounded-[8px] px-[15px] py-2">
                    <p className="text-[#344054]">Next</p>
                    <Image
                      width={20}
                      height={20}
                      src="/img/right-arrow.svg"
                      alt="arrow"
                    />
                  </div>
                }
              />
            </div>
          </div>
        ) : (
          <div
            className={`${
              theme.theme === "light" ? "text-white" : "text-white"
            } bg-[#21222D] rounded-[10px] relative py-[40px] px-[20px] flex flex-col items-center lg:justify-center mt-[40px]`}
          >
            <h1 className="text-center text-[16px] md:text-[24px] font-semibold text-socket-primary">
              No Transaction History Found
            </h1>
            <p className="my-2 text-center text-socket-secondary text-[13px] md:text-[16px]">
              To view your transaction history, please connect your wallet
            </p>
            <a
              className="mt-4 text-white w-1/2 cursor-pointer flex items-center justify-center rounded px-8 py-4 font-medium text-socket-btn-primary bg-btn hover:bg-socket-btn-primary-hover"
              onClick={(e) => {
                e.preventDefault();
                router.push("/");
              }}
            >
              <Image
                width={32}
                height={32}
                src="/img/wallet.svg"
                alt="wallet"
              />
              <span className="text-[12px] md:text-[16px]">
                &nbsp;&nbsp;Start Transaction
              </span>
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
