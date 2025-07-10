"use client";
import QRCodeReader from "@/components/QRCode/QRCodeReader";
import { purchaseIdSchema } from "@/validation/purchaseIdSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QRCodePage() {
  const router = useRouter();
  return (
    <main className="h-screen w-screen">
      <Link
        href="/admin/sales"
        prefetch={false}
        className="mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded absolute top-2 left-4"
      >
        Voltar
      </Link>
      <QRCodeReader
        onRead={(id) => {
          const validationId = purchaseIdSchema.safeParse(id);

          if (!validationId.success) {
            alert(
              `Id de Compra Inválido:\n ${validationId.error.issues
                .map((issue) => issue.message)
                .join("\n ")}`
            );
            return false;
          }

          router.push(`/admin/sales/?id=${id}`);
          return true;
        }}
      />
    </main>
  );
}
