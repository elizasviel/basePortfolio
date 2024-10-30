export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange6h: number;
  volume6h: number;
  fdv: number;
  socials?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}

export interface TokenBalance {
  token: TokenInfo;
  balance: bigint;
  valueUSD: number;
}
