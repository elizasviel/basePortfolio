import { Quote } from "../../services/trading/types";
import { formatUnits } from "ethers";
import styles from "./QuoteDisplay.module.css";

interface QuoteDisplayProps {
  quote: Quote;
  sellToken: string;
  buyToken: string;
  sellAmount: string;
}

export function QuoteDisplay({
  quote,
  sellToken,
  buyToken,
  sellAmount,
}: QuoteDisplayProps) {
  const formatAmount = (amount: string, symbol: string) => {
    const decimals = symbol === "USDC" ? 6 : 18;
    return `${formatUnits(amount, decimals)} ${symbol}`;
  };

  // Only show warning section if there are actual issues
  const hasIssues =
    quote.issues &&
    (quote.issues.allowance ||
      quote.issues.balance ||
      quote.issues.simulationIncomplete ||
      (quote.issues.invalidSourcesPassed &&
        quote.issues.invalidSourcesPassed.length > 0));

  return (
    <div className={styles["quote-display"]}>
      <h3>Quote Details</h3>
      <div className={styles["quote-details"]}>
        <div className={styles["detail-row"]}>
          <span>You Pay:</span>
          <strong>{formatAmount(sellAmount, sellToken)}</strong>
        </div>
        <div className={styles["detail-row"]}>
          <span>You Receive:</span>
          <strong>{formatAmount(quote.buyAmount, buyToken)}</strong>
        </div>
        <div className={styles["detail-row"]}>
          <span>Gas Estimate:</span>
          <span>{quote.transaction.gas} units</span>
        </div>

        {quote.fees?.zeroExFee && (
          <div className={styles["detail-row"]}>
            <span>Protocol Fee:</span>
            <span>
              {formatAmount(
                quote.fees.zeroExFee.amount || "0",
                quote.fees.zeroExFee.token || sellToken
              )}
            </span>
          </div>
        )}

        {quote.totalNetworkFee && (
          <div className={styles["detail-row"]}>
            <span>Network Fee:</span>
            <span>{formatUnits(quote.totalNetworkFee, 18)} ETH</span>
          </div>
        )}

        {quote.route?.fills && quote.route.fills.length > 0 && (
          <div className={styles["route-details"]}>
            <h4>Route Details</h4>
            {quote.route.fills.map((fill, index) => (
              <div key={index} className={styles["detail-row"]}>
                <span>{fill.source}</span>
                <span>{(Number(fill.proportionBps) / 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        )}

        {hasIssues && (
          <div className={styles.warning}>
            <h4>Warning</h4>
            {quote.issues?.allowance && (
              <p>Insufficient allowance - approval needed</p>
            )}
            {quote.issues?.balance && (
              <p>Insufficient balance for this trade</p>
            )}
            {quote.issues?.simulationIncomplete && (
              <p>Trade simulation incomplete - proceed with caution</p>
            )}
            {quote.issues?.invalidSourcesPassed &&
              quote.issues.invalidSourcesPassed.length > 0 && (
                <p>
                  Invalid liquidity sources:{" "}
                  {quote.issues.invalidSourcesPassed.join(", ")}
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
