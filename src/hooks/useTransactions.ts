import { useState, useEffect } from "react";
import { Transaction } from "../types/transaction";
import {
  getTransactions,
  saveTransaction,
} from "../services/storage/transactionStore";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      const stored = await getTransactions();
      setTransactions(stored);
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(tx: Transaction) {
    await saveTransaction(tx);
    await loadTransactions();
  }

  return { transactions, loading, addTransaction };
}
