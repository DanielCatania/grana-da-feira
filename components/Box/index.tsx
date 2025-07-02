interface BoxProps {
  children: React.ReactNode;
  title: string;
}

export default function Box({ title, children }: BoxProps) {
  return (
    <section className="w-11/12 flex flex-col shine bg-light rounded-2xl m-4">
      <h2 className="bg-dark text-xl text-primary-150 p-4 rounded-t-2xl font-bold">
        {title}:
      </h2>
      <div className="p-4">{children}</div>
    </section>
  );
}
