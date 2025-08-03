export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⏳</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Acesso Bloqueado
        </h1>
        <p className="text-gray-600">
          Você foi <strong>temporariamente bloqueado</strong>.
          <br />
          Tente novamente mais tarde ou aguarde o tempo de bloqueio (2 horas)
          expirar.
        </p>
      </div>
    </div>
  );
}
