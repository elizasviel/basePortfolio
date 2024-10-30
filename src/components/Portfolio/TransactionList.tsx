import { useTransactions } from "../../hooks/useTransactions";
import { formatEther } from "ethers";

export function TransactionList() {
  const { transactions, loading } = useTransactions();

  function formatAmount(amount: string, symbol: string) {
    if (symbol === "ETH") {
      return `${formatEther(amount)} ETH`;
    }
    // For USDC (6 decimals)
    if (symbol === "USDC") {
      return `${(Number(amount) / 1e6).toFixed(2)} USDC`;
    }
    return `${amount} ${symbol}`;
  }

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="transaction-list">
      <h2>Transaction History</h2>
      <div className="transactions-container">
        {transactions.map((tx) => (
          <div key={tx.hash} className="transaction">
            <div>
              Hash: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
            </div>
            <div>Date: {new Date(tx.timestamp).toLocaleString()}</div>
            <div>
              {formatAmount(tx.tokenIn.amount, tx.tokenIn.symbol)} →{" "}
              {formatAmount(tx.tokenOut.amount, tx.tokenOut.symbol)}
            </div>
            <div>Status: {tx.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
