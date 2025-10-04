import { capitalize } from "@/utils/textFormatter";
import { transactionContent } from "./type";

interface ITransactionProps {
  content: transactionContent;
}

export default function Transaction({ content }: ITransactionProps) {
  const isDonation = content.type === "DONATION";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const mounth = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${mounth}/${year}`;
  };
  return (
    <li className={isDonation ? "text-primary-100" : "text-secondary-150"}>
      <h3>
        <span className="font-extrabold">
          {isDonation ? "💸 Doação" : "🛍️ Compra"}
        </span>{" "}
        <span className="font-light">({content.id})</span>:
      </h3>
      <p>
        De {capitalize(content.description)} em {formatDate(content.date)}
      </p>
      <p>
        {isDonation ? "+" : "-"}
        {content.amount} Créditos para {content.user.name}{" "}
        <span className="font-light">({content.user.id})</span>
      </p>
    </li>
  );
}
