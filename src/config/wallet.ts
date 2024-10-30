import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { publicActions, http } from "viem";
//NORMAN BURNER
const PRIVATE_KEY =
  "16ed8b9ec58cf593c0bd3086c2667b648db6d2d81cf182eac7a51d34c6fa4ca5";
const BASE_RPC_URL = "https://mainnet.base.org";

// setup wallet client
export const client = createWalletClient({
  account: privateKeyToAccount(`0x${PRIVATE_KEY}` as `0x${string}`),
  chain: base,
  transport: http(BASE_RPC_URL),
}).extend(publicActions); // extend wallet client with publicActions for public client

// Common token addresses on Base
export const NETWORK_TOKENS = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

export const CHAIN_ID = 8453; // Base mainnet
