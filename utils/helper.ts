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
  Aurora,
  Base,
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
  // Goerli.chainId,
  Optimism.chainId,
  BSC.chainId,
  Arbitrum.chainId,
  Polygon.chainId,
  // ArbitrumGoerli.chainId,
  // OptimismGoerli.chainId,
  // Mumbai.chainId,
  // BSCTestnet.chainId,
  Aurora.chainId,
  // Base.chainId,
  // 59114,
];

const ethereumSeamlessContract =
  process.env.NEXT_PUBLIC_ETHEREUM_CUSTOM_CONTRACT;
const polygonSeamlessContract = process.env.NEXT_PUBLIC_POLYGON_CUSTOM_CONTRACT;
const goerliSeamlessContract = process.env.NEXT_PUBLIC_GOERLI_CUSTOM_CONTRACT;
const arbitrumSeamlessContract =
  process.env.NEXT_PUBLIC_ARBITRUM_CUSTOM_CONTRACT;
const binanceSeamlessContract = process.env.NEXT_PUBLIC_BINANCE_CUSTOM_CONTRACT;
const baseSeamlessContract = process.env.NEXT_PUBLIC_BASE_CUSTOM_CONTRACT;
const lineaSeamlessContract = process.env.NEXT_PUBLIC_LINEA_CUSTOM_CONTRACT;
const optimismSeamlessContract =
  process.env.NEXT_PUBLIC_OPTIMISM_CUSTOM_CONTRACT;

export const chainData = [
  {
    id: 1,
    chainId: Mainnet.chainId,
    name: "Ethereum",
    imgUrl: "/img/Ether.svg",
    testNetwork: false,
    transactionUrl: "https://etherscan.io/tx/",
    seamlessContract: ethereumSeamlessContract,
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...daiTokenData,
        contractAddress: "6b175474e89094c44da98b954eedeac495271d0f",
      },
      {
        ...usdcTokenData,
        contractAddress: "A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      {
        ...usdtTokenData,
        contractAddress: "dac17f958d2ee523a2206206994597c13d831ec7",
      },
      {
        ...wbtcTokenData,
        contractAddress: "2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      },
      {
        ...wethTokenData,
        contractAddress: "C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      },
    ],
  },
  {
    id: 2,
    chainId: Arbitrum.chainId,
    name: "Arbitrum",
    imgUrl: "/img/Arbitrum.svg",
    testNetwork: false,
    transactionUrl: "https://arbiscan.io/tx/",
    seamlessContract: arbitrumSeamlessContract,
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "da10009cbd5d07dd0cecc66161fc93d7c9000da1",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "af88d065e77c8cc2239327c5edb3a432268e5831",
      },
      {
        ...usdtTokenData,
        contractAddress: "fd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      },
      {
        ...wbtcTokenData,
        contractAddress: "2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      },
      {
        ...wethTokenData,
        contractAddress: "82af49447d8a07e3bd95bd0d56f35241523fbab1",
      },
    ],
  },
  {
    id: 3,
    chainId: Polygon.chainId,
    name: "Polygon",
    imgUrl: "/img/Polygon.svg",
    testNetwork: false,
    transactionUrl: "https://polygonscan.com/tx/",
    seamlessContract: polygonSeamlessContract,
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      },
      {
        ...maticTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
      {
        ...usdtTokenData,
        contractAddress: "c2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      {
        ...wbtcTokenData,
        contractAddress: "1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      },
      {
        ...wethTokenData,
        contractAddress: "7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      },
    ],
  },
  {
    id: 4,
    chainId: Optimism.chainId,
    name: "Optimism",
    imgUrl: "/img/Optimism.svg",
    testNetwork: false,
    transactionUrl: "https://optimistic.etherscan.io/tx/",
    seamlessContract: optimismSeamlessContract,
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "DA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "7f5c764cbc14f9669b88837ca1490cca17c31607",
      },
      {
        ...usdtTokenData,
        contractAddress: "94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      },
      {
        ...wbtcTokenData,
        contractAddress: "68f180fcce6836688e9084f035309e29bf0a2095",
      },
      {
        ...wethTokenData,
        contractAddress: "4200000000000000000000000000000000000006",
      },
    ],
  },
  {
    id: 5,
    chainId: BSC.chainId,
    name: "BSC",
    imgUrl: "/img/BSC.svg",
    testNetwork: false,
    transactionUrl: "https://bscscan.com/tx/",
    seamlessContract: binanceSeamlessContract,
    tokenData: [
      {
        ...bnbTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...ethTokenData,
        contractAddress: "2170Ed0880ac9A755fd29B2688956BD959F933F8",
      },
      {
        ...daiTokenData,
        contractAddress: "1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      },
      {
        ...usdcTokenData,
        contractAddress: "8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      },
      {
        ...usdtTokenData,
        contractAddress: "55d398326f99059fF775485246999027B3197955",
      },
    ],
  },
  {
    id: 6,
    chainId: Goerli.chainId,
    name: "Goerli",
    imgUrl: "/img/Ether.svg",
    testNetwork: false,
    seamlessContract: goerliSeamlessContract,
    transactionUrl: "https://goerli.etherscan.io/tx/",
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...daiTokenData,
        contractAddress: "b93cba7013f4557cDFB590fD152d24Ef4063485f",
      },
      {
        ...usdcTokenData,
        contractAddress: "0d6B12630Db150559822bb5297227C107332A8bf",
      },
      {
        ...usdtTokenData,
        contractAddress: "fad6367E97217cC51b4cd838Cc086831f81d38C2",
      },
      {
        ...wbtcTokenData,
        contractAddress: "C04B0d3107736C32e19F1c62b2aF67BE61d63a05",
      },
      {
        ...wethTokenData,
        contractAddress: "B4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      },
    ],
  },
  {
    id: 7,
    chainId: ArbitrumGoerli.chainId,
    testNetwork: true,
    name: "Arbitrum Goerli",
    imgUrl: "/img/Arbitrum.svg",
    seamlessContract: "",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "D5e1E269abF5fb03b10F92b93c7065850144A32A",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "2387e295a523347D1E12fB96C052210D49231a2B",
      },
      {
        ...usdtTokenData,
        contractAddress: "B3011837c08D3A447AC1e08CCBAb30caBFC50511",
      },
      {
        ...wbtcTokenData,
        contractAddress: "d38637f7ce85d4468dbe1b523D92f499edf58244",
      },
      {
        ...wethTokenData,
        contractAddress: "0b2Bb3D88c61E5734448A42984C3ef6c2e09649E",
      },
    ],
  },
  {
    id: 8,
    chainId: OptimismGoerli.chainId,
    name: "Optimism Goerli",
    imgUrl: "/img/Optimism.svg",
    testNetwork: true,
    seamlessContract: "",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "4A0eef739Fe45aE318831Fd02ffb609822C89931",
      },
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "D1D57Fd32AE51eB778730d4C740E8C041891F525",
      },
      {
        ...usdtTokenData,
        contractAddress: "119df4B634d3dE1325c708a10f539D1a14e45874",
      },
      {
        ...wbtcTokenData,
        contractAddress: "3491d4649aeBC9f46370DFF87c9887f557fb5954",
      },
      {
        ...wethTokenData,
        contractAddress: "329B30e4c9B671ED7fC79AECe9e56215FC40073d",
      },
    ],
  },
  {
    id: 9,
    chainId: Mumbai.chainId,
    name: "Mumbai",
    imgUrl: "/img/Polygon.svg",
    testNetwork: true,
    seamlessContract: "",
    tokenData: [
      {
        ...daiTokenData,
        contractAddress: "F14f9596430931E177469715c591513308244e8F",
      },
      {
        ...maticTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...usdcTokenData,
        contractAddress: "65D177ec36cd8aC2e502C640b97662Cf28381915",
      },
      {
        ...usdtTokenData,
        contractAddress: "d28F8b631FAcC1E838FBA8bb84df23DC3480D51A",
      },
      {
        ...wbtcTokenData,
        contractAddress: "0d787a4a1548f673ed375445535a6c7A1EE56180",
      },
      {
        ...wethTokenData,
        contractAddress: "47cE7E72334Fe164954D4f9dd95f3D20A26e8e2b",
      },
    ],
  },
  {
    id: 10,
    chainId: BSCTestnet.chainId,
    name: "BSC Testnet",
    imgUrl: "/img/BSC.svg",
    testNetwork: true,
    seamlessContract: "",
    tokenData: [
      {
        ...bnbTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...ethTokenData,
        contractAddress: "2170ed0880ac9a755fd29b2688956bd959f933f8",
      },
      {
        ...daiTokenData,
        contractAddress: "EC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
      },
      {
        ...usdcTokenData,
        contractAddress: "8324F87e66a755C8b1439df09e95DFeA44D9247D",
      },
      {
        ...usdtTokenData,
        contractAddress: "337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      },
    ],
  },
  {
    id: 11,
    chainId: Aurora.chainId,
    name: "Aurora",
    imgUrl: "/img/aurora2.png",
    testNetwork: false,
    transactionUrl: "https://explorer.aurora.dev/tx/",
    seamlessContract: "",
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
      {
        ...daiTokenData,
        contractAddress: "e3520349f477a5f6eb06107066048508498a291b",
      },
      {
        ...usdcTokenData,
        contractAddress: "b12bfca5a55806aaf64e99521918a4bf0fc40802",
      },
      {
        ...usdtTokenData,
        contractAddress: "4988a896b1227218e4a686fde5eabdcabd91571f",
      },
      {
        ...wbtcTokenData,
        contractAddress: "f4eb217ba2454613b15dbdea6e5f22276410e89e",
      },
      {
        ...wethTokenData,
        contractAddress: "C9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
      },
    ],
  },
  {
    id: 12,
    chainId: Base.chainId,
    name: "Base",
    imgUrl: "/img/base.png",
    testNetwork: false,
    transactionUrl: "https://basescan.org/tx/",
    seamlessContract: baseSeamlessContract,
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
    ],
  },
  {
    id: 13,
    chainId: 59114,
    name: "Linea",
    imgUrl: "/img/base.png",
    testNetwork: false,
    transactionUrl: "https://lineascan.build/tx/",
    seamlessContract: lineaSeamlessContract,
    tokenData: [
      {
        ...ethTokenData,
        native: true,
        contractAddress: "EeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
    ],
  },
];

export const bankTypes = [
  {
    id: 1,
    name: "Bank",
    imgUrl: "/img/banks/banking.png",
  },
  {
    id: 2,
    name: "VA",
    imgUrl: "/img/banks/va.png",
  },
  {
    id: 3,
    name: "E-Wallet",
    imgUrl: "/img/banks/ewallet.png",
  },
  {
    id: 4,
    name: "Donation",
    imgUrl: "/img/donation.png",
  },
];

export const donationData = [
  {
    id: 1,
    bank_code: "mandiri",
    bank_account_name: "LAZISNU",
    bank_account_number: "1230007771910",
  },
];

export const existBankData = [
  "anz",
  "artha",
  "bca",
  "bii",
  "bni",
  "boc",
  "bri",
  "bsm",
  "bumi_arta",
  "capital",
  "cimb",
  "citibank",
  "danamon",
  "dbs",
  "mandiri",
  "muamalat",
  "ocbc",
  "panin",
  "permata",
  "standard_chartered",
  "tokyo",
  "uob",
  "gopay",
  "ovo",
  "linkaja",
  "dana",
  "shopeepay",
];

export const eWallets = ["gopay", "ovo", "dana", "shopeepay", "linkaja"];

export const virtualAccounts = [
  "bni",
  "bri",
  "permata",
  "cimb",
  "mandiri",
  "muamalat",
  "danamon",
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

export const faqData = [
  {
    id: 1,
    question: "What is Seamless Finance?",
    answer: `<br/>Seamless Finance is a bridge from web3 to traditional finance.
                We create a single-click way to fulfill your withdrawal or
                payment needs to Indonesian Rupiah (IDR). These are the things
                you can do with Seamless Finance:
                <br />
                <br /> 1) Withdrawal to bank account, <br />
                2) Topup e-wallet (Gopay, OVO, etc), <br />
                3) Checkout ecommerce (tokopedia, shopee, blibli, etc),
                <br />
                4) Perform a payroll if you’re a DAO with onchain treasury and
                have to pay salary in IDR.
                `,
    open: false,
  },
  {
    id: 2,
    question: "Ok, any tutorial link to use Seamless?",
    answer: "<br/>Go to this link!",
    open: false,
  },
  {
    id: 3,
    question: "Does Seamless Finance has a token?",
    answer:
      "<br/>Seamless Finance has not released the token yet. Before our official announcement, any seamless token out there is not related to Seamless Finance.",
    open: false,
  },
  {
    id: 4,
    question: "Is there any retroactive airdrop plan?",
    answer:
      "<br/>We are thankful to all of the early supporters of Seamless Finance. We plan to give our retroactive appreciation to them. Stay tuned!",
    open: false,
  },
  {
    id: 5,
    question: "Does Seamless Finance take any fees?",
    answer:
      "<br/>Yes, we are. But easy, you don’t need to worry about hidden fees. The value in the “amount received” is fixed.",
    open: false,
  },
];
