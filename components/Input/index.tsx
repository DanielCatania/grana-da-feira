type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  state: {
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
};

export default function Input({ state, ...props }: InputProps) {
  return (
    <input
      {...props}
      className="w-11/12 bg-light rounded-xl p-3 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary-100"
      value={state.value}
      onChange={(e) => state.set(e.target.value as string)}
    />
  );
}
