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
import styles from "./TestPage.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Base Trading App and Portfolio</h1>

      <div className={styles.content}>
        <div className={styles.infoColumn}>
          <section className={styles.section}>
            <h2 className={styles.subtitle}>Wallet Info</h2>
            <p className={styles.text}>Address: {client.account.address}</p>
            <p className={styles.text}>Balance: {walletBalance} ETH</p>
            <PortfolioValue />
          </section>

          <section className={styles.section}>
            <div className="token-info-container">
              <h2 className={styles.subtitle}>Token Info</h2>
              {loading && <div className={styles.text}>Loading...</div>}
              {error && (
                <div className={styles.error}>Error: {error.message}</div>
              )}
              {tokenInfo && (
                <>
                  <h2 className={styles.subtitle}>
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

        <div className={styles.swapColumn}>
          <section className={`${styles.section} ${styles.fullHeight}`}>
            <SwapForm />
          </section>
        </div>

        <div className={styles.historyColumn}>
          <section className={`${styles.section} ${styles.fullHeight}`}>
            <TransactionList />
          </section>
        </div>
      </div>
    </div>
  );
}
