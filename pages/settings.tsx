"use client";
import { MainLayout } from "@/src/layouts/Main";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import { useEthers } from "@usedapp/core";
import { allTokenData, chainData, existBankData } from "@/utils/helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { Pagination, ConfigProvider, Select, Table, Input } from "antd";
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

const columns = [
  {
    title: "Destination Name",
    dataIndex: "bank_code",
    key: "bank_code",
  },
  {
    title: "Account Number",
    dataIndex: "bank_account_number",
    key: "bank_account_number",
  },
  {
    title: "Account Name",
    dataIndex: "bank_account_name",
    key: "bank_account_name",
  },
];

export default function TransactionPage() {
  const { address, connector, isConnected } = useAccount();
  const [userWalletData, setUserWalletData] = useState<any>([]);
  const scrollToTop = useRef<HTMLInputElement>(null);
  const theme = useSelector((state: RootState) => state.theme);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const { account } = useEthers();
  const [userTransactions, setUserTransactions] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: transactionsData } = useSWR(
    `/api/transaction-histories?sort[0]=id:desc&filters[wallet_address][$eq]=${address}&pagination[page]=${currentPage}&pagination[pageSize]=8`,
    fetcherStrapi
  );

  const { data: historyData } = useSWR(
    `/api/wallet-accounts?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );

  useEffect(() => {
    if (historyData?.data.data) {
      console.log(historyData.data.data);
      const temp = [];
      const theHistoryData = historyData?.data?.data;
      for (let currentData of theHistoryData) {
        temp.push({
          id: currentData.id,
          bank_account_name: currentData.attributes.bank_account_name,
          bank_code: currentData.attributes.bank_code,
          bank_account_number: currentData.attributes.bank_account_number,
        });
      }
      setUserWalletData([...temp]);
    }
  }, [historyData]);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <MainLayout>
      <div className="px-[50px] py-[25px]" ref={scrollToTop}>
        <p className="text-[32px] font-bold">Profile Account</p>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] flex justify-between">
          <Image src="/img/person.svg" width={124} height={124} alt="person" />
          <Image
            src="/img/qr_code.svg"
            width={124}
            height={124}
            alt="qr_code"
          />
        </div>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
          <p className="text-[#EB5757] font-bold text-[24px]">
            Complete Your Account Verification!
          </p>
          <p className="text-[14px] mt-[15px]">
            Enhance your account security and access. Verify your account now
            for seamless access.{" "}
            <a
              onClick={() => {
                router.push("/verify");
              }}
              className="cursor-pointer text-[#2F80ED] underline"
            >
              Verify your account here.
            </a>
          </p>
        </div>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
          <p className="text-white font-bold text-[24px]">
            Personal Information
          </p>
          <div className="mt-4 text-white">
            <p>Display Name</p>
            <input
              placeholder="Muhammad Rudi"
              className="flex-1 h-[50px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
          </div>
          <div className="mt-4 flex gap-x-4 w-full">
            <div className="flex-1">
              <p>Username</p>
              <input
                placeholder="@rudirm"
                className="flex-1 mt-[10px] h-[50px] bg-[#333333] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="flex-1">
              <p>Email</p>
              <input
                placeholder="rudi@gmail.com"
                className="flex-1 mt-[10px] h-[50px] bg-[#333333] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
          </div>
          <div className="mt-4 text-white">
            <p>Default Destination</p>
            <input
              placeholder="Enter Account Number"
              className="flex-1 h-[50px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[20px]">
              <Image src="/img/edit.svg" width={24} height={24} alt="edit" />
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="bg-[#21222D]  rounded-[12px] mt-[35px]">
          <div className="p-[20px]">
            <p className="text-white font-bold text-[24px]">Destination List</p>
          </div>
          <Table
            pagination={false}
            dataSource={userWalletData}
            columns={columns}
            rowClassName="bg-[#21222D] text-white border hover:text-black"
          />
          <div className="flex gap-x-2 p-[10px] border-b items-center mb-[10px]">
            <div className="relative w-[260px]">
              <Image
                src="/img/arrow-down.svg"
                width={18}
                height={17}
                alt="arrow"
                className="absolute right-2 bottom-[8px]"
              />
              <select className="flex-1 h-[36px] bg-transparent border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                <option>Walao</option>
                <option>Walao</option>
                <option>Walao</option>
              </select>
            </div>
            <input
              placeholder="Enter Account Number"
              className="flex-1 h-[36px] border rounded-[8px] px-[10px] text-cute text-socket-primary bg-transparent focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
            <input
              disabled
              placeholder="Account Name"
              className="flex-1 h-[36px] border rounded-[8px] px-[10px] text-cute text-socket-primary bg-transparent focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
            <button className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[8px] px-[12px] items-center">
              <span>Check</span>
            </button>
          </div>
          <div className="mt-4 flex justify-end mr-[20px] pb-[20px]">
            <button className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[20px] h-full">
              <Image src="/img/edit.svg" width={24} height={24} alt="edit" />
              <span>Save</span>
            </button>
          </div>
        </div>
        <div className="bg-[#21222D] p-[20px] rounded-[12px] mt-[35px]">
          <p className="text-white font-bold text-[24px]">Referrals</p>
          <p className="text-[16px] mt-[10px] w-4/5 text-[#CCCCCC]">
            Earn Seamless Points via our referral program. Seamless Points can
            be redeemed to perks later on. Find complete program details HERE
            for more information.
          </p>
          <p className="my-[20px] text-[#CCCCCC] text-center">
            Kindly provider a referral code for discounted fees
          </p>
          <div className="mt-4 text-white">
            <p className="text-[#CCCCCC]">Enter Referral Code</p>
            <input
              placeholder="Eg. ytdb5"
              className="flex-1 h-[50px] bg-[#333333] mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
            />
          </div>
          <div className="mt-4 flex justify-end mr-[20px] w-full">
            <button className="flex gap-x-2 linear-gradient-2 justify-center bg-btn rounded-[12px] py-[12px] px-[20px] w-full">
              Submit Referral Code
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
