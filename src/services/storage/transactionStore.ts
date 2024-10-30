import { openDB } from "idb";
import { Transaction } from "../../types/transaction";

const DB_NAME = "trading-app";
const STORE_NAME = "transactions";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: "hash" });
  },
});

export async function saveTransaction(transaction: Transaction) {
  const db = await dbPromise;
  await db.put(STORE_NAME, transaction);
}

export async function getTransactions(): Promise<Transaction[]> {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

export async function getTransaction(
  hash: string
): Promise<Transaction | undefined> {
  const db = await dbPromise;
  return db.get(STORE_NAME, hash);
}
