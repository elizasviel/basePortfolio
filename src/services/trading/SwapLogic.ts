import { Quote as ZeroExQuote } from "./types";
import { client, NETWORK_TOKENS, CHAIN_ID } from "../../config/wallet";
import { permit2Abi } from "./permit2-abi";
import {
  erc20Abi,
  getContract,
  maxUint256,
  numberToHex,
  size,
  concat,
  parseEther,
  parseUnits,
} from "viem";
import type { Hex } from "viem";
import { signTypedData } from "viem/actions";

interface SwapQuote {
  expectedOutAmount: bigint;
  quoteData: ZeroExQuote;
}

const API_BASE_URL = "/api/0x";

// Constants for commonly used addresses
const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export class SwapLogic {
  private formatTokenAddress(token: string): string {
    return token === "ETH" ? ETH_ADDRESS : token;
  }

  private async getZeroExQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    takerAddress: string
  ): Promise<ZeroExQuote> {
    const params = new URLSearchParams({
      chainId: CHAIN_ID.toString(),
      sellToken: this.formatTokenAddress(sellToken),
      buyToken: this.formatTokenAddress(buyToken),
      sellAmount,
      taker: takerAddress,
    });

    const response = await fetch(
      `${API_BASE_URL}/swap/permit2/quote?${params}`
    );

    if (!response.ok) {
      throw new Error(
        `Quote request failed: ${
          response.statusText
        }. Details: ${await response.text()}`
      );
    }

    const data = await response.json();

    if (!data.liquidityAvailable || !data.buyAmount) {
      throw new Error(
        data.liquidityAvailable
          ? "Invalid quote response: missing buyAmount"
          : "No liquidity available for this trade"
      );
    }

    return {
      ...data,
      transaction: {
        ...data.transaction,
        value: data.transaction.value || "0",
      },
    };
  }

  //Getquote handles approvals and returns a swap quote
  async getQuote(
    token: string,
    isBuy: boolean,
    inAmount: string
  ): Promise<SwapQuote> {
    const [sellToken, buyToken, formattedAmount] = isBuy
      ? ["ETH", NETWORK_TOKENS.USDC, parseEther(inAmount).toString()]
      : [NETWORK_TOKENS.USDC, "ETH", parseUnits(inAmount, 6).toString()];

    const quoteData = await this.getZeroExQuote(
      sellToken,
      buyToken,
      formattedAmount,
      client.account.address
    );

    const expectedOutAmount = BigInt(quoteData.buyAmount);

    const Permit2 = getContract({
      address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
      abi: permit2Abi,
      client,
    });
    const usdc = getContract({
      address: NETWORK_TOKENS.USDC as `0x${string}`,
      abi: erc20Abi,
      client,
    });

    try {
      const { request } = await usdc.simulate.approve([
        Permit2.address,
        maxUint256,
      ]);
      console.log("Approving Permit2 to spend USDC...", request);
      // If not, write approval
      const hash = await usdc.write.approve(request.args);
      console.log(
        "Approved Permit2 to spend USDC.",
        await client.waitForTransactionReceipt({ hash })
      );
    } catch (error) {
      console.log("Error approving Permit2:", error);
    }

    return {
      expectedOutAmount,
      quoteData,
    };
  }

  async run(quote: any) {
    console.log("Starting run with quote:", {
      permit2: quote?.quoteData?.permit2,
      transaction: quote?.quoteData?.transaction,
    });

    let signature: Hex | undefined;
    // Check if we need to handle permit2 signature
    if (quote?.quoteData?.permit2?.eip712) {
      try {
        // Fix: Use signTypedData instead of client.signTypedData
        signature = await signTypedData(client, {
          ...quote.quoteData.permit2.eip712,
        });
        console.log("Signature obtained:", signature);
      } catch (error) {
        console.error("Error signing permit2 coupon:", error);
        throw error; // Rethrow to handle it upstream
      }

      // Only proceed if we have both signature and transaction data
      if (signature && quote?.quoteData?.transaction?.data) {
        const signatureLengthInHex = numberToHex(size(signature), {
          signed: false,
          size: 32,
        });

        const transactionData = quote.quoteData.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        quote.quoteData.transaction.data = concat([
          transactionData,
          sigLengthHex,
          sig,
        ]);
        console.log("Updated transaction data with signature");
      }
    }

    // Handle the transaction
    try {
      const nonce = await client.getTransactionCount({
        address: client.account.address,
      });

      const txParams = {
        account: client.account,
        chain: client.chain,
        to: quote.quoteData.transaction.to,
        data: quote.quoteData.transaction.data,
        nonce: nonce,
        gas: quote.quoteData.transaction.gas
          ? BigInt(quote.quoteData.transaction.gas)
          : undefined,
        gasPrice: quote.quoteData.transaction.gasPrice
          ? BigInt(quote.quoteData.transaction.gasPrice)
          : undefined,
        value: quote.quoteData.transaction.value
          ? BigInt(quote.quoteData.transaction.value)
          : 0n,
      };

      console.log("Sending transaction with params:", txParams);

      const hash = await client.sendTransaction(txParams);
      console.log("Transaction hash:", hash);
      console.log(`See tx details at https://scrollscan.com/tx/${hash}`);

      return hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }
}
