import { useEffect, useState } from "react";
import { client, NETWORK_TOKENS } from "../../config/wallet";
import { formatEther } from "ethers";
import { useTokenInfo } from "../../hooks/useTokenInfo";
import { erc20Abi } from "viem";
import { readContract } from "viem/actions";
export function PortfolioValue() {
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const { tokenInfo } = useTokenInfo(NETWORK_TOKENS.WETH);

  useEffect(() => {
    async function loadBalances() {
      try {
        // Get ETH balance
        const ethBal = await client.getBalance({
          address: client.account.address,
        });
        setEthBalance(formatEther(ethBal));

        const usdcBal = await readContract(client, {
          address: NETWORK_TOKENS.USDC as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [client.account.address],
        });
        setUsdcBalance((Number(usdcBal) / 1e6).toString()); // USDC has 6 decimals
      } catch (err) {
        console.error("Failed to load balances:", err);
      }
    }
    loadBalances();
  }, []);

  const ethValue = Number(ethBalance) * (tokenInfo?.price || 0);
  const usdcValue = Number(usdcBalance);
  const totalValue = ethValue + usdcValue;

  return (
    <div className="portfolio-value">
      <h2>Portfolio Value</h2>
      <div>
        <p>
          ETH: {ethBalance} (${ethValue.toFixed(2)})
        </p>
        <p>
          USDC: {usdcBalance} (${usdcValue.toFixed(2)})
        </p>
        <h3>Total Value: ${totalValue.toFixed(2)}</h3>
      </div>
    </div>
  );
}
