"use client";
import { ConnectButton } from "@/src/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdOutlineEventNote } from "react-icons/md";
import Sun from "../public/img/Sun.svg";
import Moon from "../public/img/Moon.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, themeActions } from "../stores";

interface Props {
  children: any;
}

export const MainLayout = ({ children }: Props) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState("light");
  const [windowWidth, setWindowWidth] = useState(0);
  console.log(router, "<<< router");
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  return (
    <div
      className={`${
        theme.theme === "light" ? "main-container" : "main-container-dark"
      } relative transition duration-500 pb-5`}
    >
      <div className="z-50 navbar absolute w-full flex justify-between p-5 items-center">
        <div className="flex gap-x-4 items-center">
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className="font-bold text-xl text-gray cursor-pointer mr-2"
          >
            Seamless
          </a>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="dark_mode">
            <input
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
            ></label>
          </div>
          <ConnectButton />
        </div>
      </div>
      <div className="layout-container">
        <div
          className={`flex w-full justify-center items-center transition duration-500 mb-4 ${
            theme.theme === "light" ? "text-dark" : "text-light"
          }`}
        >
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className={`${
              router.pathname === "/"
                ? `${
                    theme.theme === "light" ? "text-black" : "text-white"
                  } underline`
                : `text-gray`
            } font-bold cursor-pointer transfer-btn`}
          >
            TRANSFER
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push("/transactions");
            }}
            className={`${
              router.pathname === "/"
                ? "text-gray"
                : `${
                    theme.theme === "light" ? "text-black" : "text-white"
                  } underline`
            } font-bold cursor-pointer transfer-btn-light`}
          >
            HISTORY
          </a>
        </div>
        {children}
      </div>
    </div>
  );
};
