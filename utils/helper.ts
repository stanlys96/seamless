import {
  Mainnet,
  DAppProvider,
  Config,
  Goerli,
  Optimism,
  BSC,
  Arbitrum,
  Polygon,
} from "@usedapp/core";

export const supportedChains = [
  Mainnet.chainId,
  Goerli.chainId,
  Optimism.chainId,
  BSC.chainId,
  Arbitrum.chainId,
  Polygon.chainId,
];

export const chainData = [
  {
    id: 1,
    chainId: Mainnet.chainId,
    name: "Ethereum",
    imgUrl: "/img/Ether.svg",
  },
  {
    id: 2,
    chainId: Arbitrum.chainId,
    name: "Arbitrum",
    imgUrl: "/img/Arbitrum.svg",
  },
  {
    id: 3,
    chainId: Polygon.chainId,
    name: "Polygon",
    imgUrl: "/img/Polygon.svg",
  },
  {
    id: 4,
    chainId: Optimism.chainId,
    name: "Optimism",
    imgUrl: "/img/Optimism.svg",
  },
  {
    id: 5,
    chainId: BSC.chainId,
    name: "BSC",
    imgUrl: "/img/BSC.svg",
  },
];

export const tokenData = [
  {
    id: 1,
    name: "ETH",
    imgUrl: "/img/eth.svg",
  },
  {
    id: 2,
    name: "DAI",
    imgUrl: "/img/dai.svg",
  },
  {
    id: 3,
    name: "USDC",
    imgUrl: "/img/usdc.svg",
  },
  {
    id: 4,
    name: "USDT",
    imgUrl: "/img/usdt.svg",
  },
  {
    id: 5,
    name: "WBTC",
    imgUrl: "/img/wbtc.svg",
  },
  {
    id: 6,
    name: "WETH",
    imgUrl: "/img/weth.svg",
  },
  {
    id: 7,
    name: "MATIC",
    imgUrl: "/img/matic.svg",
  },
  {
    id: 8,
    name: "BNB",
    imgUrl: "/img/bnb.svg",
  },
];
