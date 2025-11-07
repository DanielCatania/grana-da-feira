interface ProductSelectionProps {
  state: {
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
}

type product = { name: string; id: number };

export default function ProductSelection({
  state: { set, value },
}: ProductSelectionProps) {
  const products: product[] = [
    { name: "Brinquedos", id: 1 },
    { name: "Livros", id: 2 },
    { name: "Itens do Bazar", id: 3 },
    { name: "Diversos", id: 4 },
  ];

  return (
    <select
      value={products.find((p) => p.name === value)?.id.toString() || "0"}
      onChange={(e) => {
        const selectedId = Number(e.target.value);
        const selectedProduct = products.find((p) => p.id === selectedId);

        if (selectedProduct && selectedProduct.id !== 0) {
          set(selectedProduct.name);
        }
      }}
      className="w-11/12 bg-light rounded-xl p-3 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary-100"
    >
      {value === "" && (
        <option value={0} disabled>
          Selecionar
        </option>
      )}
      {products.map((product) => (
        <option value={product.id} key={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  );
}
