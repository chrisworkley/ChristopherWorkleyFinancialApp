"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: { userId: string }) => {
  return {
    data: [
      {
        $id: "bank-001",
        id: "acc-001",
        accountId: "acc-001",
        name: "Mock Checking",
        currentBalance: 3285.22,
        availableBalance: 3000,
        institutionId: "ins-123",
        type: "checking",
        subtype: "checking",
        appwriteItemId: "mock-item-001",
        officialName: "Mock Bank",
        mask: "1234",
        shareableId: "mock-share-id",
        accessToken: "mock-token",
        fundingSourceUrl: "https://api.mock.dwolla.com/funding-source/1",
        bankId: "bank-id-001",
        userId: "mock-user-id"
      },
      {
        $id: "bank-002",
        id: "acc-002",
        accountId: "acc-002",
        name: "Mock Savings",
        currentBalance: 14420.89,
        availableBalance: 14420.89,
        institutionId: "ins-456",
        type: "savings",
        subtype: "savings",
        appwriteItemId: "mock-item-002",
        officialName: "Mock Bank",
        mask: "5678",
        shareableId: "mock-share-id-2",
        accessToken: "mock-token-2",
        fundingSourceUrl: "https://api.mock.dwolla.com/funding-source/2",
        bankId: "bank-id-002",
        userId: "mock-user-id"
      }
    ],
    totalBanks: 2,
    totalCurrentBalance: 17706.11
  };
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: { appwriteItemId: string }) => {
  return {
    data: {
      $id: "txn-acc-001",
      id: "acc-001",
      name: "Mock Checking",
      officialName: "Mock Checking Account",
      currentBalance: 3285.22,
      availableBalance: 3000,
      type: "checking",
      subtype: "checking",
      appwriteItemId: appwriteItemId,
      institutionId: "mock-inst",
      mask: "1234",
      shareableId: "mock-share-id",
      accessToken: "mock-access-token",
      bankId: "mock-bank-id",
      fundingSourceUrl: "https://api.mock.dwolla.com/funding-source/1",
      userId: "mock-user-id"
    },
    transactions: [
      {
        $id: "txn-001",
        id: "txn-001",
        name: "Starbucks",
        amount: 6.75,
        category: "Food & Drink",
        date: "2025-05-15",
        type: "debit",
        paymentChannel: "in store",
        accountId: "acc-001",
        pending: false,
        image: "",
        senderBankId: "bank-001",
        receiverBankId: "bank-002",
        email: "chris@example.com",
        $createdAt: "2025-05-15T00:00:00Z",
        channel: "in store"
      }
    ]
  };
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};