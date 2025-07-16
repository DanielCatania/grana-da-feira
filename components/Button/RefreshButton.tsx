"use client";
import Button from "./index";
import { useRouter } from "next/navigation";

export default function RefreshButton({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  return (
    <Button
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }

        router.refresh();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
