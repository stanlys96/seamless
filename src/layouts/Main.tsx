"use client";
import { ConnectButton } from "@/src/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, themeActions } from "../stores";
import Head from "next/head";

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
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div
      className={`${
        theme.theme === "light" ? "main-container" : "main-container-dark"
      } relative transition duration-500 pb-5`}
    >
      <Head>
        <title>Seamless Finance</title>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        /> */}
      </Head>
      <div className="z-50 navbar w-full flex justify-end p-5 items-center">
        <div className="flex gap-x-2 items-center">
          <div className="flex gap-x-4 items-center lg:absolute left-[43%]">
            <a
              onClick={(e) => {
                e.preventDefault();
                router.push("/");
              }}
              className="font-bold text-xl text-gray cursor-pointer mr-2"
            >
              <img
                src={`/img/${
                  theme.theme === "dark" ? "light" : "dark"
                }-seamless.png`}
                className="w-[150px]"
              />
            </a>
          </div>
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
      <div className="layout-container">{children}</div>
    </div>
  );
};
