"use client";
import { useState } from "react";
import Button from "./index";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

export default function RefreshButton({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }

          setIsLoading(true);
          router.refresh();

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }}
        {...props}
      >
        {children}
      </Button>
      {isLoading && <Loader />}
    </>
  );
}
