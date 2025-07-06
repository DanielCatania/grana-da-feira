"use client";
import Box from "@/components/Box";
import UserSearch from "./components/UserSearch";
import { useState } from "react";
import DonationForm from "./components/DonationForm";
import { capitalize } from "@/utils/textFormatter";
import { IUserIdentification } from "@/types";

export default function Admin() {
  const [selectedUser, setSelectedUser] = useState<IUserIdentification | null>(
    null
  );

  const [credits, setCredits] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || credits <= 0 || !description) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const response = await fetch("/api/admin/donation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser.id,
        credits,
        description: capitalize(description),
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.message || data.error) {
      alert(`Erro ao registrar doação: ${data.error}`);
      return;
    }

    alert(data.message);

    setSelectedUser(null);
    setCredits(0);
    setDescription("");
  };

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-64 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-primary-150">Admin</h2>
        {selectedUser ? (
          <Box title={`Registrar doação para ${selectedUser.name}`}>
            <DonationForm
              onSubmit={handleSubmit}
              credits={{ value: credits, set: setCredits }}
              description={{ value: description, set: setDescription }}
            />
            <button
              className="mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Voltar
            </button>
          </Box>
        ) : (
          <Box title="Selecionar aluno para registrar doação">
            <UserSearch setSelectedUser={setSelectedUser} />
          </Box>
        )}
      </main>
    </div>
  );
}
