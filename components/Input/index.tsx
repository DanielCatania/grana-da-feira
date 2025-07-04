type InputProps<T extends string | number> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  state: {
    value: T;
    set: React.Dispatch<React.SetStateAction<T>>;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input<T extends string | number>({
  state,
  onChange = () => {},
  ...props
}: InputProps<T>) {
  return (
    <input
      {...props}
      className="w-11/12 bg-light rounded-xl p-3 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary-100"
      value={state.value}
      onChange={(e) => {
        onChange(e);
        const raw = e.target.value;
        const parsed =
          typeof state.value === "number"
            ? raw === ""
              ? 0
              : Number(raw)
            : raw;

        state.set(parsed as T);
      }}
    />
  );
}
