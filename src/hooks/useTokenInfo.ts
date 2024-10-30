import { useState, useEffect } from "react";
import { TokenInfo } from "../types/tokens";
import { getTokenInfo } from "../services/token/dexscreener";

export function useTokenInfo(tokenAddress: string) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTokenInfo() {
      try {
        setLoading(true);
        const info = await getTokenInfo(tokenAddress);
        setTokenInfo(info);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch token info")
        );
        setTokenInfo(null);
      } finally {
        setLoading(false);
      }
    }

    if (tokenAddress) {
      fetchTokenInfo();
    }
  }, [tokenAddress]);

  return { tokenInfo, loading, error };
}
