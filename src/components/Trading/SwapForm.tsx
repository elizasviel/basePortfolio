import { useState } from "react";
import { parseEther, parseUnits } from "ethers";
import { useSwap } from "../../hooks/useSwap";
import { QuoteDisplay } from "./QuoteDisplay";

type SwapDirection = "ETH_TO_USDC" | "USDC_TO_ETH";

export function SwapForm() {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<SwapDirection>("ETH_TO_USDC");
  const {
    loading,
    error,
    quote,
    setQuote,
    getSwapQuote,
    executeSwapTransaction,
  } = useSwap();

  const isETHToUSDC = direction === "ETH_TO_USDC";
  const inputToken = isETHToUSDC ? "ETH" : "USDC";
  const outputToken = isETHToUSDC ? "USDC" : "ETH";

  async function handleGetQuote() {
    try {
      await getSwapQuote(amount, direction);
    } catch (err) {
      console.error("Quote error:", err);
    }
  }

  async function handleSwap() {
    try {
      await executeSwapTransaction(amount, direction);
      setAmount(""); // Reset form after successful swap
      setQuote(null); // Clear the quote as well
    } catch (err) {
      console.error("Swap error:", err);
    }
  }

  function handleDirectionSwitch() {
    setDirection((prev) =>
      prev === "ETH_TO_USDC" ? "USDC_TO_ETH" : "ETH_TO_USDC"
    );
    setAmount("");
    quote && setQuote(null);
  }

  function formatInputPlaceholder() {
    return `Amount in ${inputToken}`;
  }

  function handleAmountChange(value: string) {
    // Allow empty input
    if (value === "") {
      setAmount("");
      return;
    }

    // Only allow numbers and decimals
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setAmount(value);
  }

  return (
    <div className="swap-form">
      <h2>
        Swap {inputToken} to {outputToken}
      </h2>
      <div className="swap-form-content">
        <div className="token-selection">
          <div className="input-group">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={formatInputPlaceholder()}
              disabled={loading}
            />
            <span>{inputToken}</span>
          </div>
          <button
            onClick={handleDirectionSwitch}
            className="direction-switch"
            disabled={loading}
          >
            ↕️ Switch
          </button>
          <div className="output-token">
            <span>{outputToken}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleGetQuote}
            disabled={loading || !amount}
            className="quote-button"
          >
            {loading ? "Loading..." : "Get Quote"}
          </button>
          <button
            onClick={handleSwap}
            disabled={loading || !quote}
            className="swap-button"
          >
            {loading ? "Processing..." : "Swap"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}

        {quote && amount && (
          <QuoteDisplay
            quote={quote}
            sellToken={inputToken}
            buyToken={outputToken}
            sellAmount={
              isETHToUSDC
                ? parseEther(amount).toString()
                : parseUnits(amount, 6).toString()
            }
          />
        )}
      </div>
    </div>
  );
}
