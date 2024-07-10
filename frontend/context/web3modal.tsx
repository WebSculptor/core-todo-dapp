"use client";

import { type Chain } from "viem";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coreDao as coreDaoOriginal, hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { siteConfig } from "@/config";
import { Toaster } from "@/components/ui/sonner";

export const coreDao: Chain = {
  id: 1115,
  name: "Core Blockchain Testnet",
  nativeCurrency: {
    decimals: coreDaoOriginal.nativeCurrency.decimals,
    name: "Core Blockchain Testnet",
    symbol: "tCORE",
  },
  rpcUrls: {
    default: { http: ["https://rpc.test.btcs.network"] },
  },
  blockExplorers: {
    default: {
      name: coreDaoOriginal.blockExplorers.default.name,
      url: "https://scan.test.btcs.network",
    },
  },
  testnet: true,
};

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [coreDao],
    transports: {
      // RPC URL for each chain
      [coreDao.id]: http(coreDao.rpcUrls.default.http[0]),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_W3M_PROJECT_ID!,

    // Required App Info
    appName: siteConfig.appName,

    // Optional App Info
    appDescription: siteConfig.description,
    appUrl: "https://family.co", // your app's url
    appIcon: siteConfig.icon,
  })
);

const queryClient = new QueryClient();

export const Web3ModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto" mode="dark">
          <Toaster richColors />
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
