import { TokenInfo } from "../../types/tokens";

interface PriceDisplayProps {
  tokenInfo: TokenInfo;
}

export function PriceDisplay({ tokenInfo }: PriceDisplayProps) {
  const priceChangeColor = tokenInfo.priceChange6h >= 0 ? "green" : "red";

  // Calculate the actual price change amount
  const priceChangeAmount = (tokenInfo.price * tokenInfo.priceChange6h) / 100;

  return (
    <div className="price-display">
      <div className="current-price">
        <h3>Current Price ${tokenInfo.price.toFixed(2)}</h3>
      </div>
      <div className="price-change" style={{ color: priceChangeColor }}>
        <h3>6h Change</h3>
        <span>
          {tokenInfo.priceChange6h}% (${Math.abs(priceChangeAmount).toFixed(2)}){" "}
          {tokenInfo.priceChange6h >= 0 ? "▲" : "▼"}
        </span>
      </div>
    </div>
  );
}
