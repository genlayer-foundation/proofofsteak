import { http, createConfig } from "wagmi";
import { defineChain } from "viem";

// Define the GenLayer Studio custom chain
export const genlayerStudio = defineChain({
  id: Number(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID) || 61999,
  name: process.env.NEXT_PUBLIC_GENLAYER_CHAIN_NAME || "GenLayer Studio",
  nativeCurrency: {
    decimals: 18,
    name: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
    symbol: process.env.NEXT_PUBLIC_GENLAYER_SYMBOL || "GEN",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ||
          "https://studio.genlayer.com/api",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "GenLayer Studio Explorer",
      url: "https://studio.genlayer.com",
    },
  },
});

// Create wagmi config
export const config = createConfig({
  chains: [genlayerStudio],
  transports: {
    [genlayerStudio.id]: http(),
  },
});
