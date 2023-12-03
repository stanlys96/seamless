"use client";
import { ConnectButton } from "@/src/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, themeActions } from "../stores";
import Head from "next/head";
import Image from "next/image";
import { dropdownDataHelper } from "../utils/helper";

interface Props {
  children: any;
}

export const MainLayout = ({ children }: Props) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState("light");
  const [windowWidth, setWindowWidth] = useState(0);
  const [domLoaded, setDomLoaded] = useState(false);
  const [dropdownData, setDropdownData] = useState(dropdownDataHelper);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div
      className={`${
        theme.theme === "light" ? "main-container" : "main-container-dark"
      } relative transition duration-500`}
    >
      <Head>
        <title>Seamless Finance</title>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        /> */}
        <link rel="shortcut icon" href="/img/favicon.ico" />
      </Head>
      <div className="flex">
        <div className="w-[20vw] min-h-[100vh] flex flex-col items-center border-r border-darkGray p-[20px]">
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className="font-bold text-xl text-gray cursor-pointer mr-2"
          >
            <Image src={`/img/Logo.png`} width={177} height={40} alt="logo" />
          </a>
          <div className="flex flex-col w-full">
            {dropdownData.map((theData: any, index: number) => (
              <div key={theData.id}>
                <p className="font-bold text-[18px] px-[35px] mt-[40px]">
                  {theData.name}
                </p>
                {theData.children &&
                  theData.children.map(
                    (childDataFirst: any, firstIndex: number) => (
                      <div key={firstIndex}>
                        <div
                          onClick={() => {
                            router.push(childDataFirst.route);
                          }}
                          className={`flex gap-x-2 items-center cursor-pointer mt-2 p-3 ${
                            childDataFirst.route === router.asPath &&
                            "bg-[#303750] text-[#FFFFFF]"
                          } hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]`}
                          key={childDataFirst.id}
                        >
                          {childDataFirst.icon}
                          <a className="cursor-pointer text-[13px]">
                            {childDataFirst.name}
                          </a>
                          {childDataFirst.children && (
                            <Image
                              src="/img/arrow-right.svg"
                              width={17}
                              height={18}
                              alt="arrow-right"
                            />
                          )}
                        </div>
                        {childDataFirst.route === router.asPath &&
                          childDataFirst.children &&
                          childDataFirst.children.map(
                            (childDataSecond: any, secondIndex: number) => (
                              <div key={childDataSecond.id}>
                                <div
                                  key={childDataSecond.id}
                                  className={`flex gap-x-2 items-center cursor-pointer mt-2 p-3 ${
                                    childDataSecond.route &&
                                    "text-[#FFFFFF] bg-[#303750]"
                                  } text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]`}
                                >
                                  <p className="text-[13px] ml-[28px]">
                                    {childDataSecond.name}
                                  </p>
                                  {childDataSecond.children && (
                                    <Image
                                      src={`/img/arrow-right.svg`}
                                      width={17}
                                      height={18}
                                      alt="logo"
                                    />
                                  )}
                                </div>
                                {childDataSecond.isActive &&
                                  childDataSecond.children &&
                                  childDataSecond.children.map(
                                    (
                                      childDataThird: any,
                                      thirdIndex: number
                                    ) => (
                                      <div
                                        key={childDataThird.id}
                                        className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]"
                                      >
                                        <p className="text-[13px] ml-[48px]">
                                          {childDataThird.name}{" "}
                                          {!childDataThird.isValid && "(Soon)"}
                                        </p>
                                      </div>
                                    )
                                  )}
                              </div>
                            )
                          )}
                      </div>
                    )
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className="layout-container w-full">
          <div className="z-50 bg-[#181D23] border-b border-darkGray navbar w-full flex justify-end p-5 items-center">
            <div className="flex gap-x-2 items-center justify-between w-full">
              <div className="dark_mode">
                <div className="flex gap-x-4 items-center"></div>
              </div>
              <div className="flex gap-x-1">
                <ConnectButton />
                {/* <input
              value={theme.theme}
              checked={theme.theme === "light"}
              onChange={(e) => {
                if (theme.theme === "light") {
                  dispatch(themeActions.setTheme("dark"));
                } else {
                  dispatch(themeActions.setTheme("light"));
                }
              }}
              className="dark_mode_input"
              type="checkbox"
              id="darkmode-toggle"
            />
            <label
              className="dark_mode_label"
              htmlFor="darkmode-toggle"
            ></label> */}
              </div>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

// <div>
//   <Image
//     src={`/img/payment-destination.svg`}
//     width={20}
//     height={20}
//     alt="logo"
//   />
//   <p className="text-[13px]">Payment Destination</p>
//   <Image
//     src={`/img/arrow-right.svg`}
//     width={17}
//     height={18}
//     alt="logo"
//   />
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px]">Transfer</p>
//   <Image
//     src={`/img/arrow-right.svg`}
//     width={17}
//     height={18}
//     alt="logo"
//   />
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px]">Bank Transfer</p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[48px]">
//     By Profile (Soon)
//   </p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[48px] ">E-Wallet</p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px] ">E-Commerce</p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px] ">Travel</p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 text-[#FFFFFF65] hover:bg-[#303750] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px] ">
//     Virtual Account
//   </p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px] ">Top-Up</p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]">
//   <p className="text-[13px] ml-[28px] ">
//     Utility Bills
//   </p>
// </div>
// <div className="flex gap-x-2 items-center cursor-pointer mt-2 p-3 hover:bg-[#303750] hover:text-[#FFFFFF] text-[#FFFFFF65]">
//   <Image
//     src={`/img/history.svg`}
//     width={20}
//     height={20}
//     alt="logo"
//   />
//   <p className="text-[13px]">Activity History</p>
// </div>
