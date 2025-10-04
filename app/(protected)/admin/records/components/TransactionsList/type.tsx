export type transactionContent = {
  id: string;
  type: "DONATION" | "PURCHASE";
  description: string;
  date: string;
  amount: number;
  user: {
    id: string;
    name: string;
  };
};
