import Button from "@/components/Button";
import Input from "@/components/Input";

interface SalesFormProps {
  children: React.ReactNode;
  descriptionState: {
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
  amountState: {
    value: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="flex flex-col w-4/5">{children}</label>;
}

export default function SalesForm({
  children,
  descriptionState,
  amountState,
}: SalesFormProps) {
  return (
    <form className="flex flex-col items-center gap-4 rounded-2xl bg-dark p-4">
      <Label>
        Id de Compra:
        {children}
      </Label>
      <Label>
        Produto Comprado:
        <Input<string>
          type="text"
          placeholder="Digite o nome do produto"
          state={descriptionState}
        />
      </Label>
      <Label>
        Valor:
        <Input<number>
          type="number"
          min={1}
          placeholder="Digite o valor do produto"
          state={amountState}
        />
      </Label>
      <Button>Registrar Compra</Button>
    </form>
  );
}
