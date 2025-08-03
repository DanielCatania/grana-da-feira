"use client";
import { useState } from "react";
import Box from "@/components/Box";
import DonationForm from "./DonationForm";
import UserSearch from "./UserSearch";
import { capitalize } from "@/utils/textFormatter";
import { IUserIdentification } from "@/types";
import safeFetch from "@/utils/safeFetch";

export default function Donation() {
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

    const response = await safeFetch("/api/admin/donation", {
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
    if (data.message) alert(data.message);
    if (!response.ok || data.error) {
      console.error("Erro ao registrar doação:", data.error);
      return;
    }

    setSelectedUser(null);
    setCredits(0);
    setDescription("");
  };

  return (
    <>
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
    </>
  );
}
