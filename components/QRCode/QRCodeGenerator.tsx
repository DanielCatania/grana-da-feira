"use client";
import Image from "next/image";
import QRCode from "qrcode";
import { useState, useEffect } from "react";

type QRCodeGeneratorProps = {
  id: string;
};

export default function QRCodeGenerator({ id }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    setQrCode(null);

    const generateQRCode = async () => {
      QRCode.toDataURL(id, { errorCorrectionLevel: "H" })
        .then((url: string) => {
          setQrCode(url);
        })
        .catch((err: unknown) => {
          console.error("Error generating QR code:", err);
        });
    };

    generateQRCode();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {qrCode ? (
        <Image
          width={256}
          height={256}
          src={qrCode}
          alt="Generated QR Code"
          className="w-full max-w-64 max-h-64"
        />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
}
