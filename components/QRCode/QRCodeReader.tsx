"use client";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QRCodeReader({
  onRead,
}: {
  onRead: (id: string) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    let scanner: Html5Qrcode;

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Navegador sem suporte à câmera.");
        router.push("/admin/sales");
        return;
      }

      try {
        scanner = new Html5Qrcode("reader");
        await scanner.start(
          { facingMode: "environment" },
          { fps: 5, qrbox: 150 },
          (decodedText) => {
            scanner.stop();
            onRead(decodedText);
          },
          (error) => {
            console.warn(`Erro no QR: ${error}`);
          }
        );
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
        alert("Erro ao acessar a câmera.");
      }
    };

    const timeout = setTimeout(startScanner, 300);

    return () => {
      clearTimeout(timeout);
      if (scanner) scanner.stop().catch(() => {});
    };
  }, [onRead, router]);

  return (
    <div
      id="reader"
      style={{
        width: "300px",
        height: "300px",
        display: "block",
        margin: "calc(25% - 150px) auto",
      }}
    />
  );
}
