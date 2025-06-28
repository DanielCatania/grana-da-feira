export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-11/12 bg-primary-100 rounded-xl p-3 py-2 text-dark font-extrabold shine focus:outline-none focus:ring-2 focus:ring-primary-150"
    >
      {children}
    </button>
  );
}
