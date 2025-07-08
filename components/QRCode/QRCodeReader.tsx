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
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Navegador sem suporte à câmera.");
      router.push("/admin/sales");
      return;
    }

    const scanner = new Html5Qrcode("reader");

    const start = async () => {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 5,
          qrbox: 300,
        },
        (decodedText) => {
          onRead(decodedText);
          scanner
            .stop()
            .catch((err) => console.error("Error stopping scanner:", err));
        },
        (error) => {
          console.warn(`Erro no QRcode: ${error}`);
        }
      );
    };

    start();
  }, [router, onRead]);

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
