import {
  Mainnet,
  Goerli,
  Optimism,
  BSC,
  Arbitrum,
  Polygon,
} from "@usedapp/core";

export const ethTokenData = {
  id: 1,
  name: "ETH",
  imgUrl: "/img/eth.svg",
  coingecko: "ethereum",
  native: false,
  decimals: 18,
};

export const daiTokenData = {
  id: 2,
  name: "DAI",
  imgUrl: "/img/dai.svg",
  coingecko: "dai",
  native: false,
  decimals: 6,
};

export const usdcTokenData = {
  id: 3,
  name: "USDC",
  imgUrl: "/img/usdc.svg",
  coingecko: "usd-coin",
  native: false,
  decimals: 6,
};

export const usdtTokenData = {
  id: 4,
  name: "USDT",
  imgUrl: "/img/usdt.svg",
  coingecko: "tether",
  native: false,
  decimals: 6,
};

export const wbtcTokenData = {
  id: 5,
  name: "WBTC",
  imgUrl: "/img/wbtc.svg",
  coingecko: "wrapped-bitcoin",
  native: false,
  decimals: 18,
};

export const wethTokenData = {
  id: 6,
  name: "WETH",
  imgUrl: "/img/weth.svg",
  coingecko: "weth",
  native: false,
  decimals: 18,
};

export const maticTokenData = {
  id: 7,
  name: "MATIC",
  imgUrl: "/img/matic.svg",
  coingecko: "matic-network",
  native: false,
  decimals: 18,
};

export const bnbTokenData = {
  id: 8,
  name: "BNB",
  imgUrl: "/img/bnb.svg",
  coingecko: "binancecoin",
  native: false,
  decimals: 18,
};

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
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...daiTokenData,
        contractAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
      },
      {
        ...usdcTokenData,
        contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      },
      {
        ...wethTokenData,
        contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      },
    ],
  },
  {
    id: 2,
    chainId: Arbitrum.chainId,
    name: "Arbitrum",
    imgUrl: "/img/Arbitrum.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      },
      {
        ...wethTokenData,
        contractAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      },
    ],
  },
  {
    id: 3,
    chainId: Polygon.chainId,
    name: "Polygon",
    imgUrl: "/img/Polygon.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      },
      {
        ...maticTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      },
      {
        ...wethTokenData,
        contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      },
    ],
  },
  {
    id: 4,
    chainId: Optimism.chainId,
    name: "Optimism",
    imgUrl: "/img/Optimism.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      },
      {
        ...usdtTokenData,
        contractAddress: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x68f180fcce6836688e9084f035309e29bf0a2095",
      },
      {
        ...wethTokenData,
        contractAddress: "0x4200000000000000000000000000000000000006",
      },
    ],
  },
  {
    id: 5,
    chainId: BSC.chainId,
    name: "BSC",
    imgUrl: "/img/BSC.svg",
    tokenData: [
      {
        ...bnbTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...ethTokenData,
        contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      },
      {
        ...daiTokenData,
        contractAddress: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      },
      {
        ...usdtTokenData,
        contractAddress: "0x55d398326f99059fF775485246999027B3197955",
      },
    ],
  },
];
