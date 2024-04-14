"use client";
import { BuyComponent } from "@/src/components/BuyComponent";
import { SellComponent } from "@/src/components/SellComponent";
import { MainLayout } from "@/src/layouts/Main";
import { useState } from "react";

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState<"sell" | "buy">(
    "sell"
  );
  return (
    <MainLayout>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center mt-5 bg-container rounded-[20px]">
          <div
            onClick={() => setCurrentCategory("sell")}
            className={`cursor-pointer ${
              currentCategory === "sell" && "bg-btn"
            } rounded-l-[20px] pr-[16px] pl-[16px] py-[10px]`}
          >
            <p>Sell Crypto</p>
          </div>
          <div
            onClick={() => setCurrentCategory("buy")}
            className={`cursor-pointer ${
              currentCategory === "buy" && "bg-btn"
            } rounded-r-[20px] pl-[16px] pr-[16px] py-[10px]`}
          >
            <p>Buy Crypto</p>
          </div>
        </div>
      </div>
      {currentCategory === "sell" && (
        <SellComponent
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />
      )}
      {currentCategory === "buy" && (
        <BuyComponent
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />
      )}
    </MainLayout>
  );
}
