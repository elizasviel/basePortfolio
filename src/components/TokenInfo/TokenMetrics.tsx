import { TokenInfo } from "../../types/tokens";

interface TokenMetricsProps {
  tokenInfo: TokenInfo;
}
export function TokenMetrics({ tokenInfo }: TokenMetricsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  return (
    <div className="token-metrics">
      <div className="volume">
        <h3>6h Volume</h3>
        <span>{formatNumber(tokenInfo.volume6h)}</span>
      </div>
      <div className="fdv">
        <h3>Fully Diluted Value</h3>
        <span>{formatNumber(tokenInfo.fdv)}</span>
      </div>
    </div>
  );
}
