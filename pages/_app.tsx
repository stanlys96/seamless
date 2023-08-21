import { AppProps } from "next/app";
import "../styles/globals.css";

import {
  Mainnet,
  DAppProvider,
  Config,
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

const config: Config = {
  noMetamaskDeactivate: true,
  autoConnect: true,
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: MAINNET_RPC_URL,
    [Goerli.chainId]: GOERLI_RPC_URL as any,
    [Optimism.chainId]: OPTIMISM_RPC_URL,
    [BSC.chainId]: BSC_RPC_URL,
    [Arbitrum.chainId]: ARBITRUM_RPC_URL,
    [Polygon.chainId]: POLYGON_RPC_URL,
    [ArbitrumGoerli.chainId]: ARBITRUM_GOERLI_RPC_URL,
    [OptimismGoerli.chainId]: OPTIMISM_GOERLI_RPC_URL,
    [Mumbai.chainId]: MUMBAI_RPC_URL,
    [BSCTestnet.chainId]: BSC_TESTNET_RPC_URL,
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DAppProvider config={config}>
        <Component {...pageProps} />
      </DAppProvider>
    </>
  );
}

export default MyApp;
