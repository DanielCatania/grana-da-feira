export default function PermanentBlockedPage() {
  return (
    <div className="h-[110vh] w-[110vw] flex items-center justify-center bg-black px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">🚫</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Acesso Bloqueado
        </h1>
        <p className="text-gray-600">
          Você foi <strong>permanentemente bloqueado</strong> por abuso de
          acesso.
          <br />
          Caso ache que isso é um erro, entre em contato com o administrador.
        </p>
      </div>
    </div>
  );
}
