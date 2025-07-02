"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

interface UserSearchProps {
  setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function UserSearch({ setSelectedUser }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string }[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
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
        console.error("Unexpected format:", data);
        return;
      }

      setResults(data.users);
    } catch (err) {
      console.error("Search error:", err);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex flex-col items-center gap-4"
    >
      <Input
        type="text"
        placeholder="Buscar aluno por nome"
        state={{ set: setQuery, value: query }}
      />
      <Button type="submit">Buscar</Button>

      <ul className="grid grid-cols-1 gap-2 w-full max-h-40 overflow-y-scroll">
        {results.map((user, i) => (
          <li
            key={i}
            className="bg-primary-150 shine p-1 rounded-lg cursor-pointer"
            onClick={() => setSelectedUser(user.name)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </form>
  );
}
