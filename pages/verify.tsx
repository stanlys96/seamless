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
import { Pagination, ConfigProvider, Select, Table, Input, Upload } from "antd";
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

export default function VerifyPage() {
  const { address, connector, isConnected } = useAccount();
  const scrollToTop = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <MainLayout>
      <div className="px-[50px] py-[25px]" ref={scrollToTop}>
        <p className="text-[32px] font-bold">Verify Your Account</p>
        <div className="bg-[#21222D] p-[10px] rounded-[12px] flex gap-x-4 mt-[25px]">
          <div className="bg-[#090D1F] flex flex-col justify-center items-center p-[10px] rounded-[10px] h-fit">
            <label className="" htmlFor="upload-file">
              <Image
                src="/img/upload_id.svg"
                width={600}
                height={300}
                alt="upload"
              />
            </label>
            <input
              id="upload-file"
              className="border border-dotted"
              type="file"
            />
            <div className="flex justify-center items-center my-[40px]">
              <button className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[30px] items-center">
                <span>Check</span>
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="text-white">
              <p className="text-[#CCCCCC]">Name</p>
              <input
                placeholder="Ex. John Doe"
                className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="mt-4 text-white">
              <p className="text-[#CCCCCC]">ID Number</p>
              <input
                placeholder="Ex. John Doe"
                className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="flex gap-x-4 items-center mt-4">
              <div className="w-full">
                <p className="text-[#CCCCCC]">Province</p>
                <div className="relative">
                  <Image
                    src="/img/arrow-down.svg"
                    width={18}
                    height={17}
                    alt="arrow"
                    className="absolute right-2 bottom-[10px]"
                  />
                  <select className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                    <option>Walao</option>
                    <option>Walao</option>
                    <option>Walao</option>
                  </select>
                </div>
              </div>
              <div className="w-full">
                <p className="text-[#CCCCCC]">City</p>
                <div className="relative">
                  <Image
                    src="/img/arrow-down.svg"
                    width={18}
                    height={17}
                    alt="arrow"
                    className="absolute right-2 bottom-[10px]"
                  />
                  <select className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                    <option>Walao</option>
                    <option>Walao</option>
                    <option>Walao</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 text-white">
              <p className="text-[#CCCCCC]">Address</p>
              <input
                placeholder="Ex. John Doe"
                className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="flex gap-x-4 items-center mt-4">
              <div className="w-full">
                <p className="text-[#CCCCCC]">Blood Type</p>
                <div className="relative">
                  <Image
                    src="/img/arrow-down.svg"
                    width={18}
                    height={17}
                    alt="arrow"
                    className="absolute right-2 bottom-[10px]"
                  />
                  <select className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                    <option>Walao</option>
                    <option>Walao</option>
                    <option>Walao</option>
                  </select>
                </div>
              </div>
              <div className="w-full">
                <p className="text-[#CCCCCC]">Religion</p>
                <div className="relative">
                  <Image
                    src="/img/arrow-down.svg"
                    width={18}
                    height={17}
                    alt="arrow"
                    className="absolute right-2 bottom-[10px]"
                  />
                  <select className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden">
                    <option>Walao</option>
                    <option>Walao</option>
                    <option>Walao</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center mt-[20px]">
              <button className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[30px] items-center">
                <span>Submit Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
