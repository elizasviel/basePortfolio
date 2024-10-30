import { useState } from "react";
import { useTransactions } from "./useTransactions";
import { Quote } from "../services/trading/types";
import { parseEther, parseUnits } from "ethers";
import { NETWORK_TOKENS } from "../config/wallet";
import { SwapLogic } from "../services/trading/SwapLogic";

type SwapDirection = "ETH_TO_USDC" | "USDC_TO_ETH";

export function useSwap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const { addTransaction } = useTransactions();
  const swapLogic = new SwapLogic();

  async function getSwapQuote(amount: string, direction: SwapDirection) {
    if (!amount || isNaN(Number(amount))) {
      throw new Error("Please enter a valid amount");
    }

    setError(null);
    setLoading(true);
    setQuote(null);

    try {
      const isBuy = direction === "ETH_TO_USDC";
      const token = isBuy ? NETWORK_TOKENS.USDC : "ETH";

      const swapQuote = await swapLogic.getQuote(token, isBuy, amount);
      setQuote(swapQuote.quoteData);
      return swapQuote.quoteData;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get quote";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    quote,
    setQuote,
    getSwapQuote,
    executeSwapTransaction: async (
      amount: string,
      direction: SwapDirection
    ) => {
      if (!quote) {
        throw new Error("No quote available");
      }

      setError(null);
      setLoading(true);

      try {
        const swapQuote = {
          expectedOutAmount: BigInt(quote.buyAmount),
          quoteData: quote,
        };
        await swapLogic.run(swapQuote);

        const [sellToken, buyToken, sellAmount] =
          direction === "ETH_TO_USDC"
            ? ["ETH", "USDC", parseEther(amount).toString()]
            : ["USDC", "ETH", parseUnits(amount, 6).toString()];

        await addTransaction({
          hash: quote.transaction.hash || "",
          timestamp: Date.now(),
          tokenIn: {
            address: direction === "ETH_TO_USDC" ? "ETH" : NETWORK_TOKENS.USDC,
            symbol: sellToken,
            amount: sellAmount,
          },
          tokenOut: {
            address: direction === "ETH_TO_USDC" ? NETWORK_TOKENS.USDC : "ETH",
            symbol: buyToken,
            amount: quote.buyAmount,
          },
          status: "completed",
        });

        return quote;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Swap failed";
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
  };
}
