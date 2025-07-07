"use client";
import QRCodeReader from "@/components/QRCode/QRCodeReader";
import { useRouter } from "next/navigation";

export default function QRCodePage() {
  const router = useRouter();
  return (
    <main>
      <QRCodeReader
        onRead={(id) => {
          router.push(`/admin/sales/${id}`);
        }}
      />
    </main>
  );
}
