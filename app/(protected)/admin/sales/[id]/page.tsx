interface PageProps {
  params: { id: string };
}
export default async function SaleID({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <h1>{id}</h1>
    </>
  );
}
