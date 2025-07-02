"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function UserSearch() {
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
    <form onSubmit={handleSearch}>
      <Input
        type="text"
        placeholder="Buscar aluno por nome"
        state={{ set: setQuery, value: query }}
      />
      <Button type="submit">Buscar</Button>

      <ul>
        {results.map((user, i) => (
          <li key={i}>{user.name}</li>
        ))}
      </ul>
    </form>
  );
}
