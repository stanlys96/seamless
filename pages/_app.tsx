import "../styles/globals.css";
import { AppProps } from "next/app";
import { store } from "@/src/stores";
import { Provider } from "react-redux";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
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
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { Web3Modal } from "@web3modal/react";
// import ethe from "@web3modal/ethereum"
import { EthereumClient } from "@web3modal/ethereum";

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

// const config: Config = {
//   noMetamaskDeactivate: true,
//   autoConnect: false,
//   readOnlyChainId: Mainnet.chainId,
//   readOnlyUrls: {
//     [Mainnet.chainId]: MAINNET_RPC_URL as any,
//     // [Goerli.chainId]: GOERLI_RPC_URL as any,
//     [Optimism.chainId]: OPTIMISM_RPC_URL,
//     [BSC.chainId]: BSC_RPC_URL,
//     [Arbitrum.chainId]: ARBITRUM_RPC_URL,
//     [Polygon.chainId]: POLYGON_RPC_URL as any,
//     // [ArbitrumGoerli.chainId]: ARBITRUM_GOERLI_RPC_URL,
//     // [OptimismGoerli.chainId]: OPTIMISM_GOERLI_RPC_URL,
//     // [Mumbai.chainId]: MUMBAI_RPC_URL,
//     // [BSCTestnet.chainId]: BSC_TESTNET_RPC_URL,
//     [Aurora.chainId]: AURORA_RPC_URL,
//     // [Base.chainId]: BASE_RPC_URL,
//   },
// };

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum, linea, optimism, base],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.public.http[0],
      }),
    }),
  ]
);

const config = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "85bb78d3e28a1aa94144cacb71c3e242",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={config}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
