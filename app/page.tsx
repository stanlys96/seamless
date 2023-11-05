"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "transparent",
};

export default function Home() {
  const [currentScroll, setCurrentScroll] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollHome = useRef<HTMLInputElement>(null);
  const scrollFeatures = useRef<HTMLInputElement>(null);
  const scrollPayment = useRef<HTMLInputElement>(null);
  const scrollWallets = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window) {
      setCurrentScroll(window.scrollY);
    }
    return window.addEventListener("scroll", () => {
      setCurrentScroll(window.scrollY);
    });
  }, []);
  return (
    <main className="text-white">
      <nav className="flex justify-between items-center flex-wrap nav-container lg:px-[80px] px-[15px] h-[11vh] fixed w-full">
        <Image src="/Logo.svg" width={208} height={56} alt="walao" />
        <div className="hidden lg:block">
          <a
            onClick={() =>
              scrollHome.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }
            className={`${
              currentScroll <= 650 && "justTextGradient"
            } p-[10px] cursor-pointer text-[16px]`}
          >
            Home
          </a>
          <a
            onClick={() =>
              scrollFeatures.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }
            className={`${
              currentScroll <= 1642 &&
              currentScroll >= 651 &&
              "justTextGradient"
            } p-[10px] cursor-pointer text-[16px]`}
          >
            Features
          </a>
          <a
            onClick={() =>
              scrollPayment.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }
            className={`${
              currentScroll >= 1643 &&
              currentScroll <= 2150 &&
              "justTextGradient"
            } p-[10px] cursor-pointer text-[16px]`}
          >
            Payment
          </a>
          <a
            onClick={() =>
              scrollWallets.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }
            className={`${
              currentScroll >= 2151 && "justTextGradient"
            } p-[10px] cursor-pointer text-[16px]`}
          >
            Wallets
          </a>
        </div>
        <button
          onClick={() =>
            (window.location.href = "https://app.seamless.finance")
          }
          className="btn-launch px-[12px] py-[10px] lg:px-[24px] lg:py-[13px] rounded-[10px] text-white"
        >
          Launch App
        </button>
      </nav>
      <div
        ref={scrollHome}
        className="pt-[11vh] relative bg-mainBg grid grid-cols-1 lg:grid-cols-2 lg:px-[80px] px-[15px] overflow-hidden"
      >
        <div className="flex flex-col justify-center lg:h-[89vh]">
          <p className="font-bold text-center lg:text-left text-[24px] lg:text-[48px]">
            Revolutionize Your Payments with Seamless Crypto Solutions
          </p>
          <p className="my-[16px] text-center lg:text-left lg:my-[32px] text-lightWhite">
            Discover the ease of setting IDR bills instantly from your preferred
            hot or cold wallets - all it takes is one click, one fee.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={() =>
                (window.location.href = "https://app.seamless.finance")
              }
              className="btn-launch z-50 p-[16px] w-fit rounded-[16px] font-bold flex items-center gap-x-3 text-white"
            >
              Launch App{" "}
              <Image
                src="/Arrow Right.svg"
                width={32}
                height={32}
                alt="Arrow"
              />
            </button>
          </div>
        </div>
        <div>
          <Image
            src="/Illustration.svg"
            width={604}
            height={585}
            alt="illustration"
          />
        </div>
        <Image
          className="absolute top-[100px] hidden lg:block"
          src="/weird2.svg"
          height={120}
          width={998}
          alt="weird"
        />
        <Image
          className="absolute left-[700px] top-[100px] hidden lg:block"
          src="/weird2.svg"
          height={120}
          width={998}
          alt="weird"
        />
      </div>
      <div
        ref={scrollFeatures}
        className="lg:px-[80px] px-[15px] bg-secondaryBg py-[32px] flex flex-col gap-y-[18px] min-h-[100vh] relative overflow-hidden"
      >
        <p className="text-center text-gradient text-[20px] lg:text-[24px]">
          Why Choose Us
        </p>
        <p className="text-center text-[24px] lg:text-[48px] font-bold">
          Our Commitment to Your Convenience
        </p>
        <p className="text-[16px] lg:text-[18px] text-center text-secondWhite">
          We prioritize user convenience and ensure seamless compatibility with
          over 300 wallets. Discover why we&apos;re your ideal choice for
          hassle-free transactions
        </p>
        <div className="flex flex-col gap-y-[20px]">
          <div className="flex gap-[20px] flex-wrap justify-center">
            <div className="p-[20px] lg:p-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px] lg:w-[40vw] content-card">
              <div className="flex flex-col lg:flex-row items-center gap-x-[20px]">
                <Image
                  src="/Icon Container.svg"
                  height={98}
                  width={98}
                  alt="icon"
                />
                <p className="text-[16px] my-[15px] lg:my-0 lg:text-[24px] font-semibold">
                  Simplified Payment Process
                </p>
              </div>
              <p className="text-[14px] lg:text-[18px] text-thirdWhite text-center lg:text-left">
                Say goodbye to the hassle of toggling between wallets,
                exchanges, and banking apps. Our state-of-the-art dapp is all
                you need for a smooth transaction journey, streamlining your
                crypto experience.
              </p>
            </div>
            <Image
              className="hidden lg:block"
              src="/VerticalLine.svg"
              height={100}
              width={1}
              alt="line"
            />
            <div className="p-[20px] lg:p-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px] lg:w-[40vw] content-card">
              <div className="flex flex-col lg:flex-row  items-center gap-x-[20px]">
                <Image src="/lamp.svg" height={98} width={98} alt="icon" />
                <p className="text-[16px] my-[15px] lg:my-0 lg:text-[24px] font-semibold">
                  Rapid Transaction Completion
                </p>
              </div>
              <p className="text-[14px]  lg:text-[18px] text-thirdWhite text-center lg:text-left">
                Time is money, and with Seamless Finance, you save both.
                Complete your payments in a single transaction, cutting out the
                need for multiple, time-consuming validations.
              </p>
            </div>
          </div>
          <Image
            className="hidden lg:block"
            src="/Line.svg"
            height={20}
            width={1280}
            alt="line"
          />
          <div className="flex gap-[20px] flex-wrap justify-center">
            <div className="p-[20px] lg:p-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px] content-card lg:w-[40vw]">
              <div className="flex flex-col lg:flex-row items-center gap-x-[20px]">
                <Image src="/bag.svg" height={98} width={98} alt="icon" />
                <p className="text-[16px] my-[15px] lg:my-0 lg:text-[24px] font-semibold">
                  Maximized Cost Efficiency
                </p>
              </div>
              <p className="text-[14px] lg:text-[18px] text-thirdWhite text-center lg:text-left">
                Enjoy the luxury of low fees without compromising on quality.
                Our operations are optimized to ensure you pay considerably
                less, making us a cost-effective alternative to other platforms.
              </p>
            </div>
            <Image
              className="hidden lg:block"
              src="/VerticalLine.svg"
              height={100}
              width={1}
              alt="line"
            />
            <div className="p-[20px] lg:p-[50px] rounded-tl-[50px] rounded-br-[50px] rounded-tr-[20px] rounded-bl-[20px] content-card lg:w-[40vw]">
              <div className="flex flex-col lg:flex-row items-center gap-x-[20px]">
                <Image
                  src="/transaction.svg"
                  height={98}
                  width={98}
                  alt="icon"
                />
                <p className="text-[16px] my-[15px] lg:my-0 lg:text-[24px] font-semibold">
                  Transaction Accuracy
                </p>
              </div>
              <p className="text-[14px] lg:text-[18px] text-thirdWhite text-center lg:text-left">
                With a single point of destination account validation, we
                significantly minimize the risk of errors, ensuring your
                transactions are secure and precise.
              </p>
            </div>
          </div>
        </div>
        <Image
          className="absolute top-[300px] left-[-800px] hidden lg:block"
          src="/weird2.svg"
          height={120}
          width={998}
          alt="weird"
        />
        <Image
          className="absolute top-[600px] right-0 hidden lg:block"
          src="/u.svg"
          height={240}
          width={240}
          alt="weird"
        />
        <Image
          className="absolute top-[50px] right-0 hidden lg:block"
          src="/D.svg"
          height={260}
          width={260}
          alt="weird"
        />
      </div>
      <div
        ref={scrollPayment}
        className="bg-thirdBg px-[20px] py-[40px] lg:p-[80px] relative overflow-hidden"
      >
        <div>
          <p className="text-gradient text-[18px] lg:text-[24px] text-center">
            Payment Destination
          </p>
          <p className="lg:py-0 py-[20px] text-[24px] lg:text-[48px] font-bold text-center">
            Over 100 Payment Destinations
          </p>
          <p className="text-secondWhite text-[14px] lg:text-[18px] text-center">
            Explore an expansive range of payment options, including banks,
            e-commerce platforms, e-wallets, virtual accounts, and utility bill
            services.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-[35px] lg:mt-[70px]">
          <Carousel
            autoplay
            autoplaySpeed={2500}
            afterChange={(slide: number) => setCurrentSlide(slide)}
            rootClassName="px-[20px] md:px-[80px]"
            className="z-50"
            dots={false}
            arrows={true}
            prevArrow={
              <Image
                width={9}
                height={18}
                alt="Chevron Left"
                src="/Chevron Left.svg"
              />
            }
            nextArrow={
              <Image
                width={9}
                height={18}
                alt="Chevron Right"
                src="/Chevron Right.svg"
              />
            }
          >
            <p className="font-semibold leading-[160px] text-center text-thirdWhite text-[24px] lg:text-[48px]">
              Bank Transfer
            </p>
            <p className="font-semibold leading-[160px] text-center text-thirdWhite text-[24px] lg:text-[48px]">
              E-Wallet
            </p>
            <p className="font-semibold leading-[160px] text-center text-thirdWhite text-[24px] lg:text-[48px]">
              E-Commerce
            </p>
            <p className="font-semibold leading-[160px] text-center text-thirdWhite text-[24px] lg:text-[48px]">
              Utility Bill Service
            </p>
          </Carousel>
          {currentSlide === 0 && (
            <div className="flex gap-y-[15px] gap-x-[10px] lg:gap-[24px] justify-center lg:justify-start mt-[40px] lg:mt-0 flex-wrap">
              <Image width={112} height={80} alt="mandiri" src="/mandiri.svg" />
              <Image width={112} height={80} alt="bni" src="/bni.svg" />
              <Image width={112} height={80} alt="bri" src="/bri.svg" />
              <Image width={112} height={80} alt="bca" src="/bca.svg" />
              <Image width={112} height={80} alt="permata" src="/permata.svg" />
              <Image width={112} height={80} alt="Danamon" src="/Danamon.svg" />
              <Image width={112} height={80} alt="AndMore" src="/AndMore.svg" />
            </div>
          )}
          {currentSlide === 1 && (
            <div className="flex gap-y-[15px] gap-x-[10px] lg:gap-[24px] justify-center lg:justify-start mt-[40px] lg:mt-0 flex-wrap">
              <Image width={112} height={80} alt="linkaja" src="/linkaja.svg" />
              <Image width={112} height={80} alt="ovo" src="/ovo.svg" />
              <Image
                width={112}
                height={80}
                alt="shopeepay"
                src="/shopeepay.svg"
              />
              <Image width={112} height={80} alt="gopay" src="/gopay.svg" />
              <Image width={112} height={80} alt="dana" src="/dana.svg" />
              <Image width={112} height={80} alt="AndMore" src="/AndMore.svg" />
            </div>
          )}
          {currentSlide === 2 && (
            <div className="flex gap-y-[15px] gap-x-[10px] lg:gap-[24px] justify-center lg:justify-start mt-[40px] lg:mt-0 flex-wrap">
              <Image width={112} height={80} alt="shopee" src="/shopee.svg" />
              <Image
                width={112}
                height={80}
                alt="tokopedia"
                src="/tokopedia.svg"
              />
              <Image width={112} height={80} alt="blibli" src="/Blibli.svg" />
              <Image width={112} height={80} alt="lazada" src="/lazada.svg" />
              <Image width={112} height={80} alt="AndMore" src="/AndMore.svg" />
            </div>
          )}
          {currentSlide === 3 && (
            <div className="flex gap-y-[15px] gap-x-[10px] lg:gap-[24px] justify-center lg:justify-start mt-[40px] lg:mt-0 flex-wrap">
              <Image width={112} height={80} alt="AirBnB" src="/AirBnB.svg" />
              <Image
                width={112}
                height={80}
                alt="Tiket.com"
                src="/Tiket.com.svg"
              />
              <Image
                width={112}
                height={80}
                alt="Traveloka"
                src="/Traveloka.svg"
              />
              <Image
                width={112}
                height={80}
                alt="PegiPegi"
                src="/PegiPegi.svg"
              />
              <Image width={112} height={80} alt="Oyo" src="/Oyo.svg" />
              <Image
                width={112}
                height={80}
                alt="Reddoorz"
                src="/Reddoorz.svg"
              />
              <Image width={112} height={80} alt="AndMore" src="/AndMore.svg" />
            </div>
          )}
        </div>
        <Image
          className="absolute top-0 left-0 hidden lg:block"
          src="/naruto.svg"
          height={160}
          width={184}
          alt="weird"
        />
        <Image
          className="absolute left-[-100px] bottom-0 hidden lg:block"
          src="/weird2.svg"
          height={120}
          width={998}
          alt="weird"
        />
        <Image
          className="absolute bottom-0 rotate-[-45deg] right-0 hidden lg:block"
          src="/u.svg"
          height={240}
          width={240}
          alt="weird"
        />
      </div>
      <div
        ref={scrollWallets}
        className="lg:px-[80px] px-[15px] py-[40px] relative bg-secondaryBg overflow-hidden"
      >
        <p className="text-gradient text-[18px] lg:text-[24px] text-center">
          Our Trusted Partnership
        </p>
        <p className="text-[24px] lg:text-[48px] font-bold text-center my-[15px]">
          Reliability in Every Connection
        </p>
        <p className="text-[14px] lg:text-[18px] text-secondWhite text-center">
          Count on us for unwavering support and collaboration in every step of
          our partnership
        </p>
        <div className="w-full flex justify-center mt-[40px]">
          <button className="rounded-[18px] btn-activate text-black p-[8px]">
            <Image
              src="/Activate-Logo 1.svg"
              width={297}
              height={90}
              alt="Activate"
            />
          </button>
        </div>
        <Image
          className="absolute top-[50px] right-0 hidden lg:block"
          src="/D.svg"
          height={260}
          width={260}
          alt="weird"
        />
      </div>
      <footer className="py-[40px] bg-mainBg">
        <div className="lg:px-[80px] px-[15px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between">
            <div className="flex flex-col items-center lg:items-start lg:gap-y-[20px]">
              <Image src="/Logo.svg" width={208} height={56} alt="logo" />
              <p className="text-[20px] my-[20px] lg:my-0 text-fourthWhite lg:text-left text-center">
                Transforming the Way You Handle Crypto Payments - Fast, Simple,
                Secure
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex gap-x-[10px] md:gap-x-[30px] justify-end items-center">
                <a
                  onClick={() =>
                    scrollHome.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }
                  className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer"
                >
                  Home
                </a>
                <a
                  onClick={() =>
                    scrollFeatures.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }
                  className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer"
                >
                  Why Choose Us
                </a>
                <a
                  onClick={() =>
                    scrollPayment.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }
                  className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer"
                >
                  Payments
                </a>
                <a
                  onClick={() =>
                    scrollWallets.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }
                  className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer"
                >
                  Wallets
                </a>
                <a className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer">
                  Docs
                </a>
                <a className="text-[14px] lg:text-[20px] text-center text-fourthWhite cursor-pointer">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-darkBlue my-[35px]" />
        <div className="lg:px-[80px] px-[15px] flex justify-around flex-wrap">
          <p className="text-[16px] text-fourthWhite">
            © 2023 Seamless Finance. All rights reserved.
          </p>
          <div className="flex gap-x-[53px] lg:mt-0 mt-[25px]">
            <Image src="/Facebook.svg" height={24} width={24} alt="Facebook" />
            <Image src="/Twitter.svg" height={24} width={24} alt="Twitter" />
            <Image
              src="/Instagram.svg"
              height={24}
              width={24}
              alt="Instagram"
            />
            <Image src="/LinkedIn.svg" height={24} width={24} alt="LinkedIn" />
          </div>
        </div>
      </footer>
    </main>
  );
}
