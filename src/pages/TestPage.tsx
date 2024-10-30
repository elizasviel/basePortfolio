import { useTokenInfo } from "../hooks/useTokenInfo";
import { PriceDisplay } from "../components/TokenInfo/PriceDisplay";
import { TokenMetrics } from "../components/TokenInfo/TokenMetrics";
import { TokenSocials } from "../components/TokenInfo/TokenSocials";
import { client, NETWORK_TOKENS } from "../config/wallet";
import { useEffect, useState } from "react";
import { formatEther } from "ethers/utils";
import { PortfolioValue } from "../components/Portfolio/PortfolioValue";
import { TransactionList } from "../components/Portfolio/TransactionList";
import { SwapForm } from "../components/Trading/SwapForm";

export function TestPage() {
  const [walletBalance, setWalletBalance] = useState<string>("");
  const { tokenInfo, loading, error } = useTokenInfo(NETWORK_TOKENS.WETH);

  useEffect(() => {
    async function checkWallet() {
      try {
        const balance = await client.getBalance({
          address: client.account.address,
        });
        setWalletBalance(formatEther(balance));
      } catch (err) {
        console.error("Wallet check failed:", err);
      }
    }
    checkWallet();
  }, []);

  return (
    <div className="portfolio-container">
      <h1 className="portfolio-title">Base Trading App and Portfolio</h1>

      <div className="portfolio-content">
        <div className="info-column">
          <section className="section">
            <h2 className="subtitle">Wallet Info</h2>
            <p className="text">Address: {client.account.address}</p>
            <p className="text">Balance: {walletBalance} ETH</p>
            <PortfolioValue />
          </section>

          <section className="section">
            <div className="token-info-container">
              <h2 className="subtitle">Token Info</h2>
              {loading && <div className="text">Loading...</div>}
              {error && <div className="error">Error: {error.message}</div>}
              {tokenInfo && (
                <>
                  <h2 className="subtitle">
                    {tokenInfo.name} ({tokenInfo.symbol})
                  </h2>
                  <PriceDisplay tokenInfo={tokenInfo} />
                  <TokenMetrics tokenInfo={tokenInfo} />
                  <TokenSocials tokenInfo={tokenInfo} />
                </>
              )}
            </div>
          </section>
        </div>

        <div className="swap-column">
          <section className="section full-height">
            <SwapForm />
          </section>
        </div>

        <div className="history-column">
          <section className="section full-height">
            <TransactionList />
          </section>
        </div>
      </div>
    </div>
  );
}
