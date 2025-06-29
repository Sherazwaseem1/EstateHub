import api from "../api"; // Assuming you have an axios instance in api.ts
import type { CreateTransaction, Transaction } from "../types"; // Adjust the import path and type names as necessary

// Create a new transaction
export const createTransaction = async (
  transaction: CreateTransaction
): Promise<Transaction> => {
  const response = await api.post<Transaction>("/transactions/", transaction);
  return response.data;
};

// Function to get transactions by Property ID
export const getTransactionsByPropertyId = async (
  propertyId: number
): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>(
    `/transactions/property/${propertyId}`
  );
  return response.data;
};
