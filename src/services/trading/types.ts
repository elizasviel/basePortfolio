export interface Quote {
  blockNumber?: string;
  buyAmount: string; // Required as we check for this
  buyToken: string; // Required as it's part of core swap data
  fees?: {
    integratorFee?: {
      amount?: string;
      token?: string;
    } | null;
    zeroExFee?: {
      amount?: string;
      token?: string;
      type?: string;
    } | null;
    gasFee?: string | null;
  };
  issues?: {
    allowance?: string | null;
    balance?: string | null;
    simulationIncomplete?: boolean;
    invalidSourcesPassed?: string[];
  };
  liquidityAvailable: boolean; // Required as we check for this
  minBuyAmount?: string;
  permit2?: {
    type?: string;
    hash?: string;
    eip712?: {
      types?: {
        TokenPermissions?: {
          name?: string;
          type?: string;
        }[];
        PermitTransferFrom?: {
          name?: string;
          type?: string;
        }[];
        EIP712Domain?: {
          name?: string;
          type?: string;
        }[];
      };
      domain?: {
        name?: string;
        chainId?: number;
        verifyingContract?: string;
      };
      message?: {
        permitted?: {
          token?: string;
          amount?: string;
        };
        spender?: string;
        nonce?: string;
        deadline?: string;
      };
      primaryType?: string;
    };
  };
  route?: {
    fills?: {
      from?: string;
      to?: string;
      source?: string;
      proportionBps?: string;
    }[];
    tokens?: {
      address?: string;
      symbol?: string;
    }[];
  };
  sellAmount: string; // Required as it's part of core swap data
  sellToken: string; // Required as it's part of core swap data
  tokenMetadata?: {
    buyToken?: {
      buyTaxBps?: string;
      sellTaxBps?: string;
    };
    sellToken?: {
      buyTaxBps?: string;
      sellTaxBps?: string;
    };
  };
  totalNetworkFee?: string;
  transaction: {
    // Required for executing the swap
    to: string;
    data: string;
    gas: string;
    gasPrice: string;
    value: string;
    hash?: string;
  };
  zid?: string;
}
export interface SwapParams {
  token: string;
  isBuy: boolean;
  inAmount: string;
}
