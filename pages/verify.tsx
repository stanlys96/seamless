"use client";
import { MainLayout } from "@/src/layouts/Main";
import useSWR from "swr";
import { axiosApi, fetcherProvinces, fetcherStrapi } from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Image from "next/image";
import Swal from "sweetalert2";
import { ColorRing } from "react-loader-spinner";
import AWS from "aws-sdk";
import axios from "axios";

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

const bloodTypes = ["A", "B", "AB", "O"];
const religions = [
  "ISLAM",
  "KRISTEN",
  "KATOLIK",
  "BUDDHA",
  "HINDU",
  "KONG HU CU",
];

export default function VerifyPage() {
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [provinceId, setProvinceId] = useState(11);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedBloodType, setSelectedBloodType] = useState("A");
  const [selectedReligion, setSelectedReligion] = useState("ISLAM");
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [idCard, setSelectedIdCard] = useState<any>(null);
  const { data: provincesData } = useSWR(
    `/provinsi?api_key=${process.env.NEXT_PUBLIC_PROVINCE_API_KEY}`,
    fetcherProvinces
  );
  const { data: districtsData, mutate: mutateDistrictData } = useSWR(
    `/kabupaten?api_key=${process.env.NEXT_PUBLIC_PROVINCE_API_KEY}&id_provinsi=${provinceId}`,
    fetcherProvinces
  );

  const provincesResult = provincesData?.data?.value;
  const districtsResult = districtsData?.data?.value;

  const scrollToTop = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: personalData, mutate: mutatePersonalData } = useSWR(
    `/api/user-wallets?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );

  const walletPersonalData = personalData?.data?.data;

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!name || !idNumber || !userAddress || !idCard) {
      return Swal.fire("Info!", "Please fill all the data!", "info");
    }
    setVerificationLoading(true);

    const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET as string;
    const REGION = process.env.NEXT_PUBLIC_S3_REGION as string;

    const data = new FormData();
    data.append("file", idCard, address + ".png");
    data.append("files", idCard);
    data.append("ref", "api::user-wallet.user-wallet");
    data.append("refId", walletPersonalData[0].id);
    data.append("field", "id_card");

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    });

    const s3 = new AWS.S3({
      params: { S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: (address + ".png") as any,
      Body: idCard,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt: any) => {
        console.log("Uploading " + (evt.loaded * 100) / evt.total + "%");
      })
      .promise();

    await upload.then((res) => {
      console.log("Upload success!");
    });

    if (walletPersonalData && walletPersonalData.length > 0) {
      try {
        const uploadRes = await axiosApi({
          method: "POST",
          url: "/api/upload",
          data,
        });
        await axiosApi.put(`/api/user-wallets/${walletPersonalData[0].id}`, {
          data: {
            name: name,
            id_number: idNumber,
            province: selectedProvince?.name ?? "",
            city: selectedDistrict?.name ?? "",
            address: userAddress,
            blood_type: selectedBloodType,
            religion: selectedReligion,
          },
        });
        setVerificationLoading(false);
        Swal.fire("Success!", "Sucessfully applied for KYC!", "success").then(
          (res) => router.push("/settings")
        );
      } catch (e) {
        setVerificationLoading(false);
        console.log(e);
      }
    } else {
      try {
        const res = await axiosApi.post(`/api/user-wallets`, {
          data: {
            wallet_address: address,
            name: name,
            id_number: idNumber,
            province: selectedProvince?.name ?? "",
            city: selectedDistrict?.name ?? "",
            address: userAddress,
            blood_type: selectedBloodType,
            religion: selectedReligion,
          },
        });
        const newId = res?.data?.data?.id;
        const data = new FormData();
        data.append("files", idCard);
        data.append("ref", "api::user-wallet.user-wallet");
        data.append("refId", newId);
        data.append("field", "id_card");
        const uploadRes = await axiosApi({
          method: "POST",
          url: "/api/upload",
          data,
        });
        setVerificationLoading(false);
        Swal.fire("Success!", "Sucessfully applied for KYC!", "success").then(
          (res) => router.push("/settings")
        );
      } catch (e) {
        console.log(e);
        setVerificationLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  useEffect(() => {
    if (!selectedDistrict && districtsResult && districtsResult.length > 0) {
      setSelectedDistrict(districtsResult[0]);
    }
    if (!selectedProvince && provincesResult && provincesResult.length > 0) {
      setSelectedProvince(provincesResult[0]);
    }
  }, [provincesResult, districtsResult]);

  return (
    <MainLayout>
      <div className="px-[50px] py-[25px]" ref={scrollToTop}>
        <p className="text-[32px] font-bold text-white">Verify Your Account</p>
        <div className="bg-[#21222D] p-[10px] rounded-[12px] flex flex-col md:flex-row gap-4 mt-[25px]">
          <div className="bg-[#090D1F] flex flex-col justify-center items-center p-[10px] rounded-[10px] h-fit">
            <label className="" htmlFor="upload-file">
              <img
                className="w-[580px] h-[200px]"
                src={`${
                  !idCard ? "/img/upload_id.svg" : URL.createObjectURL(idCard)
                }`}
                alt="upload"
              />
            </label>

            <input
              accept="image/*"
              multiple={false}
              onChange={(e) => {
                console.log(e?.target?.files?.[0]);
                setSelectedIdCard(e?.target?.files?.[0]);
              }}
              id="upload-file"
              className="border border-dotted"
              type="file"
            />
            <div className="flex justify-center items-center my-[40px]">
              <button
                onClick={async () => {
                  // wlao
                  const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_EXECUTE}ktp1.png`
                  );

                  console.log(response, "<<<");
                  if (idCard) {
                  }
                }}
                className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[30px] items-center"
              >
                <span className="text-white">Check</span>
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="text-white">
              <p className="text-[#CCCCCC]">Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. John Doe"
                className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
              />
            </div>
            <div className="mt-4 text-white">
              <p className="text-[#CCCCCC]">ID Number</p>
              <input
                maxLength={16}
                type="number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
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
                  <select
                    value={selectedProvince?.name ?? ""}
                    onChange={async (e) => {
                      const thePicked = e.target.value;
                      const theProvinceId = provincesResult?.find(
                        (provinceData: any) => provinceData.name === thePicked
                      ).id;
                      setProvinceId(theProvinceId);
                      setSelectedProvince({
                        id: theProvinceId,
                        name: thePicked,
                      });
                      setSelectedDistrict(null);
                    }}
                    className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                  >
                    {provincesResult?.map((province: any, index: number) => (
                      <option key={province.id}>{province.name}</option>
                    ))}
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
                  <select
                    value={selectedDistrict?.name ?? ""}
                    onChange={(e) => {
                      const thePicked = e.target.value;
                      const theProvinceId = districtsResult?.find(
                        (district: any) => district.name === thePicked
                      ).id_provinsi;
                      const theDistrictId = districtsResult?.find(
                        (district: any) => district.name === thePicked
                      ).id;
                      setSelectedDistrict({
                        id: theDistrictId,
                        id_provinsi: theProvinceId,
                        name: thePicked,
                      });
                    }}
                    className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                  >
                    {districtsResult?.map((district: any, index: number) => (
                      <option key={district.id}>{district.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 text-white">
              <p className="text-[#CCCCCC]">Address</p>
              <input
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
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
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                  >
                    {bloodTypes.map((bloodType: string) => (
                      <option key={bloodType}>{bloodType}</option>
                    ))}
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
                  <select
                    value={selectedReligion}
                    onChange={(e) => setSelectedReligion(e.target.value)}
                    className="flex-1 h-[40px] bg-transparent mt-[10px] border rounded-[8px] px-[10px] text-cute text-socket-primary focus-visible:outline-none w-full focus:max-w-none overflow-hidden"
                  >
                    {religions.map((religion: string) => (
                      <option key={religion}>{religion}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center mt-[20px]">
              <button
                disabled={verificationLoading}
                onClick={handleSubmit}
                className="flex gap-x-2 linear-gradient-2 bg-btn rounded-[12px] py-[12px] px-[30px] items-center"
              >
                {verificationLoading ? (
                  <ColorRing
                    visible={true}
                    height="24"
                    width="24"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  <span className="text-white">Submit Verification</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
