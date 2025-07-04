"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

interface UserSearchProps {
  setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function UserSearch({ setSelectedUser }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ name: string }[] | "initial">(
    "initial"
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (query.length < 2) {
        setError("A busca deve ter pelo menos 2 caracteres.");
        setResults("initial");
        return;
      }

      setError("");

      const res = await fetch(
        `/api/admin/search?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Error:", err.error);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data.users)) {
        throw new Error("Invalid response format");
      }

      setResults(data.users);
    } catch (err) {
      console.error("Search error:", err);
      setResults("initial");
      setError("Erro ao buscar usuários. Tente novamente.");
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex flex-col items-center gap-4"
    >
      <Input
        type="text"
        placeholder="Buscar aluno por nome (Min: 2 caracteres)"
        state={{ set: setQuery, value: query }}
        onChange={() => {
          if (results !== "initial") setResults("initial");
          if (error) setError("");
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Buscar</Button>

      <ul className="grid grid-cols-1 gap-2 w-full max-h-40 overflow-y-scroll">
        {results === "initial" ? (
          ""
        ) : results.length > 0 ? (
          results.map((user, i) => (
            <li
              key={i}
              className="bg-primary-150 shine p-1 rounded-lg cursor-pointer"
              onClick={() => setSelectedUser(user.name)}
            >
              {user.name}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center">
            Nenhum resultado encontrado
          </li>
        )}
      </ul>
    </form>
  );
}
