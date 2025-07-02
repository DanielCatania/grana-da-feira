"use client";
import Box from "@/components/Box";
import UserSearch from "./UserSearch";
import { useState } from "react";

export default function Admin() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-64 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-primary-150">Admin</h2>
        {selectedUser ? (
          <Box title={`Adicionar crédito para ${selectedUser}`}>
            <button
              className="mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Voltar
            </button>
          </Box>
        ) : (
          <Box title="Selecionar aluno para adicionar crédito">
            <UserSearch setSelectedUser={setSelectedUser} />
          </Box>
        )}
      </main>
    </div>
  );
}
