export interface Transaction {
  hash: string;
  timestamp: number;
  tokenIn: {
    address: string;
    symbol: string;
    amount: string;
  };
  tokenOut: {
    address: string;
    symbol: string;
    amount: string;
  };
  status: "pending" | "completed" | "failed";
}
