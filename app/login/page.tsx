"use client";
import "./style.css";
import { useState } from "react";
import Image from "next/image";

import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EMAIL]", email);
    console.log("[PASSWORD]", password);
  };

  return (
    <div className="bg-geometric">
      <div className="overlay flex-col flex items-center justify-center">
        <main className="w-1/3 min-w-60">
          <Image
            src="/logo.png"
            width={500}
            height={200}
            alt="Ícone de notas de dinheiro com asas ao lado escrito Grana da Feira em verde com letras quadradas."
            className="w-full"
          />
          <h1 className="sr-only">Área de Login</h1>
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email" className="sr-only">
              Seu e-mail institucional
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Seu E-mail institucional"
              required
              state={{ value: email, set: setEmail }}
              aria-describedby="emailDesc"
            />
            <p id="emailDesc" className="text-xs text-neutral">
              Seu e-mail institucional é aquele fornecido pelo cólegio.
            </p>
            <label htmlFor="password" className="sr-only">
              Digite sua senha
            </label>
            <Input
              type="password"
              placeholder="Senha"
              id="password"
              required
              state={{ value: password, set: setPassword }}
              aria-describedby="passwordDesc"
            />
            <p id="passwordDesc" className="text-xs text-neutral text-center">
              Sua senha no primeiro acesso será sua data de aniversário neste
              formato DDMMYYYY.
            </p>
            <Button type="submit">ENTRAR</Button>
          </form>
        </main>
      </div>
    </div>
  );
}
