import Box from "@/components/Box";
import Transaction from "./Transaction";
import { transactionContent } from "./type";

interface ITransactionListProps {
  transactions: transactionContent[];
  isDonation?: boolean;
}

export default function TransactionsList({
  transactions,
  isDonation = false,
}: ITransactionListProps) {
  const total = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  return (
    <Box
      title={`Registros de ${isDonation ? "Doações" : "Vendas"} (${
        transactions.length
      })`}
    >
      <h2 className="text-primary-150 text-2xl">
        Valor total de créditos {isDonation ? "gerados" : "gastos"}:{" "}
        <span className="font-bold">${total}</span>
      </h2>
      <ul className="overflow-y-scroll max-h-60">
        {transactions.map((trasaction) => (
          <Transaction key={trasaction.id} content={trasaction} />
        ))}
      </ul>
    </Box>
  );
}
