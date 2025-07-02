import Link from "next/link";

export default async function Dashboard() {
  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-60">
        <div>
          <p className="text-2xl">Olá</p>
        </div>
        <div>
          <Link href="/change-password" className="text-primary-100 underline">
            Trocar senha
          </Link>
        </div>
      </main>
    </div>
  );
}
