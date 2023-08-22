import {
  Mainnet,
  Goerli,
  Optimism,
  BSC,
  Arbitrum,
  Polygon,
  ArbitrumGoerli,
  OptimismGoerli,
  Mumbai,
  BSCTestnet,
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
  decimals: 18,
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
  ArbitrumGoerli.chainId,
  OptimismGoerli.chainId,
  Mumbai.chainId,
  BSCTestnet.chainId,
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
  {
    id: 6,
    chainId: Goerli.chainId,
    name: "Goerli",
    imgUrl: "/img/Ether.svg",
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...daiTokenData,
        contractAddress: "0xb93cba7013f4557cDFB590fD152d24Ef4063485f",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x0d6B12630Db150559822bb5297227C107332A8bf",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
      },
      {
        ...wethTokenData,
        contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      },
    ],
  },
  {
    id: 7,
    chainId: ArbitrumGoerli.chainId,
    name: "Arbitrum Goerli",
    imgUrl: "/img/Arbitrum.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0xD5e1E269abF5fb03b10F92b93c7065850144A32A",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x2387e295a523347D1E12fB96C052210D49231a2B",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xB3011837c08D3A447AC1e08CCBAb30caBFC50511",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0xd38637f7ce85d4468dbe1b523D92f499edf58244",
      },
      {
        ...wethTokenData,
        contractAddress: "0x0b2Bb3D88c61E5734448A42984C3ef6c2e09649E",
      },
    ],
  },
  {
    id: 8,
    chainId: OptimismGoerli.chainId,
    name: "Optimism Goerli",
    imgUrl: "/img/Optimism.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0x4A0eef739Fe45aE318831Fd02ffb609822C89931",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0xD1D57Fd32AE51eB778730d4C740E8C041891F525",
      },
      {
        ...usdtTokenData,
        contractAddress: "0x119df4B634d3dE1325c708a10f539D1a14e45874",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x3491d4649aeBC9f46370DFF87c9887f557fb5954",
      },
      {
        ...wethTokenData,
        contractAddress: "0x329B30e4c9B671ED7fC79AECe9e56215FC40073d",
      },
    ],
  },
  {
    id: 9,
    chainId: Mumbai.chainId,
    name: "Mumbai",
    imgUrl: "/img/Polygon.svg",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "0xF14f9596430931E177469715c591513308244e8F",
      },
      {
        ...maticTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x65D177ec36cd8aC2e502C640b97662Cf28381915",
      },
      {
        ...usdtTokenData,
        contractAddress: "0xd28F8b631FAcC1E838FBA8bb84df23DC3480D51A",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0x0d787a4a1548f673ed375445535a6c7A1EE56180",
      },
      {
        ...wethTokenData,
        contractAddress: "0x47cE7E72334Fe164954D4f9dd95f3D20A26e8e2b",
      },
    ],
  },
  {
    id: 10,
    chainId: BSCTestnet.chainId,
    name: "BSC Testnet",
    imgUrl: "/img/BSC.svg",
    tokenData: [
      {
        ...bnbTokenData,
        native: true,
        contractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...ethTokenData,
        contractAddress: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      },
      {
        ...daiTokenData,
        contractAddress: "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
      },
      {
        ...usdcTokenData,
        contractAddress: "0x8324F87e66a755C8b1439df09e95DFeA44D9247D",
      },
      {
        ...usdtTokenData,
        contractAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      },
    ],
  },
];

export const bankData = [
  {
    id: 1,
    name: "BCA",
    imgUrl: "/img/bca.png",
  },
  {
    id: 2,
    name: "BRI",
    imgUrl: "/img/bri.png",
  },
  {
    id: 3,
    name: "BNI",
    imgUrl: "/img/bni.png",
  },
];

export const allTokenData = [
  ethTokenData,
  daiTokenData,
  usdcTokenData,
  usdtTokenData,
  wbtcTokenData,
  wethTokenData,
  maticTokenData,
  bnbTokenData,
];
