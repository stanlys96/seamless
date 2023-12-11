import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { dropdownDataHelper } from "../utils/helper";
import { useState } from "react";
import { useAccount } from "wagmi";
import Swal from "sweetalert2";

interface Props {
  open: boolean;
  handleClose: (param1: any) => void;
  setOpen: (param1: any) => void;
}

export default function SideDrawer({ open, handleClose, setOpen }: Props) {
  const router = useRouter();
  const [dropdownData, setDropdownData] = useState(dropdownDataHelper);
  const { address, connector, isConnected } = useAccount();
  return (
    <div
      className={[
        open ? "w-full z-50 translate-x-0" : "translate-x-full w-0 -z-10",
        "sidebar fixed h-full overflow-scroll bg-[#000000] top-0 right-0 text-lg transition-all duration-300 ",
      ].join(" ")}
    >
      <div className="sidebar-header overflow-y-scroll flex justify-between py-4 pl-3 pr-5 border-b border-white/30">
        <div className="flex items-center justify-center -mt-1 -ml-1">
          <div>
            <a
              className="cursor-pointer"
              onClick={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <span className="flex justify-center items-center relative w-[145px] h-[44px]">
                <Image
                  src="/img/Logo.png"
                  alt="BaseLogo"
                  width={130}
                  height={28}
                  layout="fixed"
                  quality={100}
                />
              </span>
            </a>
          </div>
        </div>
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={handleClose}
        >
          <div className="pr-3">
            <Image
              src="/img/handleClose.png"
              alt="mobile-logo"
              layout="fixed"
              width="14"
              height="14"
              quality={100}
            />
          </div>
        </div>
      </div>
      <div className="py-4 pl-3 pr-5 flex flex-col items-center gap-y-4 w-full">
        {dropdownData.map((theData: any, index: number) => (
          <div className="w-full" key={theData.id}>
            <p className="font-bold text-[18px] text-white px-[35px]">
              {theData.name}
            </p>
            {theData.children &&
              theData.children.map(
                (childDataFirst: any, firstIndex: number) => (
                  <div key={firstIndex}>
                    <div
                      onClick={() => {
                        if (childDataFirst.url) {
                          return window.open(childDataFirst.url);
                        }
                        if (
                          (childDataFirst.route === "/settings" ||
                            childDataFirst.route === "/verify") &&
                          !address
                        ) {
                          return Swal.fire(
                            "Info!",
                            "Please login with your wallet!",
                            "info"
                          );
                        }
                        if (!childDataFirst.route) {
                          return Swal.fire(
                            "Info!",
                            "Page still in development!",
                            "info"
                          );
                        }
                        router.push(childDataFirst.route);
                      }}
                      className={`flex gap-x-2 text-center cursor-pointer mt-2 p-3 ${
                        childDataFirst.route === router.asPath &&
                        "bg-[#303750] text-[#FFFFFF]"
                      } hover:bg-[#303750] text-[#FFFFFF65] hover:text-[#FFFFFF]`}
                      key={childDataFirst.id}
                    >
                      {childDataFirst.icon}
                      <a className="cursor-pointer text-center text-[13px]">
                        {childDataFirst.name}
                      </a>
                    </div>
                  </div>
                )
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
