import Link from "next/link";

export default function SalesMode() {
  return (
    <main>
      <h1>Mode de Venda</h1>
      <Link href="/admin/sales/qrcode">Ler QRcode</Link>
    </main>
  );
}
