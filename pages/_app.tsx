import "../styles/globals.css";
import "../styles/custom.css";
import { AppProps } from "next/app";
import { store } from "@/src/stores";
import { Provider } from "react-redux";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import {
  arbitrum,
  base,
  bsc,
  goerli,
  linea,
  optimism,
  polygon,
} from "viem/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

const GOERLI_RPC_URL = process.env.NEXT_PUBLIC_GOERLI_RPC_URL;
const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL;
const OPTIMISM_RPC_URL = process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL;
const ARBITRUM_RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL;
const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL;
const ARBITRUM_GOERLI_RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL;
const OPTIMISM_GOERLI_RPC_URL = process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL;
const MUMBAI_RPC_URL = process.env.NEXT_PUBLIC_MUMBAI_RPC_URL;
const BSC_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_BSC_TESTNET_RPC_URL;
const AURORA_RPC_URL = process.env.NEXT_PUBLIC_AURORA_RPC_URL;
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;
const LINEA_RPC_URL = process.env.NEXT_PUBLIC_LINEA_RPC_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const rpcUrlHelper = [
  {
    chainId: 1,
    rpcUrl: MAINNET_RPC_URL,
  },
  {
    chainId: 137,
    rpcUrl: POLYGON_RPC_URL,
  },
  {
    chainId: 42161,
    rpcUrl: ARBITRUM_RPC_URL,
  },
  // {
  //   chainId: 59144,
  //   rpcUrl: LINEA_RPC_URL,
  // },
  {
    chainId: 10,
    rpcUrl: OPTIMISM_RPC_URL,
  },
  {
    chainId: 8453,
    rpcUrl: BASE_RPC_URL,
  },
  {
    chainId: 56,
    rpcUrl: BSC_RPC_URL,
  },
  {
    chainId: 5,
    rpcUrl: GOERLI_RPC_URL,
  },
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http:
          rpcUrlHelper.find((theData) => theData.chainId === chain.id)
            ?.rpcUrl ?? "",
      }),
    }),
  ]
);

const metadata = {
  name: "Seamless Finance",
  description: "Seamless Finance",
  url: "https://seamless.finance",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID ?? "",
  metadata,
});

const config = createConfig({
  autoConnect: true,
  connectors: [
    // new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: PROJECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId: PROJECT_ID ?? "",
  chains,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
