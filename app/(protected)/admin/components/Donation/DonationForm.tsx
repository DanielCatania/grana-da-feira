import Input from "@/components/Input";
import Button from "@/components/Button";
import ProductSelection from "@/app/(protected)/admin/components/ProductSelection";

interface DonationFormProps {
  description: {
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
  credits: { value: number; set: React.Dispatch<React.SetStateAction<number>> };
  onSubmit: (e: React.FormEvent) => void;
}

export default function DonationForm({
  description,
  credits,
  onSubmit,
}: DonationFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-dark text-primary-100 flex items-center justify-center p-4 rounded mt-4 flex-wrap"
    >
      <label className="text-xl mb-2 w-2/3">
        Produtos doados
        <ProductSelection state={description} />
      </label>
      <label className="text-xl mb-2 w-1/3">
        Créditos Ganhos
        <Input
          type="number"
          placeholder="0"
          min={1}
          state={{ value: credits.value, set: credits.set }}
        />
      </label>
      <Button type="submit">Registrar doação</Button>
    </form>
  );
}
