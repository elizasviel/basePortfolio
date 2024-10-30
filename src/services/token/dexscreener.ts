import { TokenInfo } from "../../types/tokens";

const DEXSCREENER_API_BASE = "https://api.dexscreener.com/latest";

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    h6: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h6: number;
  };
  priceChange: {
    h6: number;
  };
  fdv: number;
  links?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[];
}

export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
  try {
    // Using the search endpoint instead of direct token lookup
    const response = await fetch(
      `${DEXSCREENER_API_BASE}/dex/search?q=${tokenAddress}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: DexScreenerResponse = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      throw new Error("No trading pairs found for this token");
    }

    // Filter for Base chain pairs only
    const basePairs = data.pairs.filter((pair) => pair.chainId === "base");

    if (basePairs.length === 0) {
      throw new Error("No Base chain pairs found for this token");
    }

    // Find the pair with the highest volume
    const pair = basePairs.reduce((prev, current) => {
      const prevVolume = prev.volume?.h6 || 0;
      const currentVolume = current.volume?.h6 || 0;
      return currentVolume > prevVolume ? current : prev;
    });

    return {
      address: tokenAddress,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      decimals: 18,
      price: parseFloat(pair.priceUsd || "0"),
      priceChange6h: pair.priceChange?.h6 || 0,
      volume6h: pair.volume?.h6 || 0,
      fdv: pair.fdv || 0,
      socials: pair.links || {},
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch token info: ${error.message}`);
    }
    throw new Error("Failed to fetch token info");
  }
}
