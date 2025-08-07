import Link from "next/link";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BackButton({
  href,
  onClick,
  children,
}: BackButtonProps) {
  const style =
    "mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded";

  const content: React.ReactNode = children || "Voltar";

  return (
    <>
      {href && (
        <Link href={href} className={style}>
          {content}
        </Link>
      )}
      {!href && onClick && (
        <button className={style} onClick={onClick}>
          {content}
        </button>
      )}
    </>
  );
}
