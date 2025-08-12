"use client";
import BackButton from "@/components/Button/BackButton";
import Header from "@/components/Header";
import QRCodeReader from "@/components/QRCode/QRCodeReader";
import { purchaseIdSchema } from "@/validation/purchaseIdSchema";
import { useRouter } from "next/navigation";

export default function QRCodePage() {
  const router = useRouter();
  return (
    <>
      <>
        <Header>
          <BackButton href="/admin/sales" />
        </Header>
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
      </>
    </>
  );
}
