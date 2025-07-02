"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

interface ChangePasswordFormProps {
  passwordDefault: string;
}

export default function ChangePasswordForm({
  passwordDefault,
}: ChangePasswordFormProps) {
  const [formErrors, setFormErrors] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8)
      return setFormErrors("A senha deve ter no mínimo 8 caracteres");

    if (password === passwordDefault)
      return setFormErrors("A senha deve ser diferente da senha padrão");

    setFormErrors("");
    // temporary
    alert("Senha trocada!");
  };

  return (
    <div className="bg-geometric">
      <div className="overlay flex-col flex items-center justify-center">
        <main className="w-2/5 min-w-60">
          <h1 className="text-center text-4xl m-4 text-primary-150">
            Mudar senha
          </h1>
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="password" className="sr-only">
              Digite sua senha
            </label>
            <Input
              type="password"
              placeholder="Nova senha"
              id="password"
              required
              state={{ value: password, set: setPassword }}
              aria-describedby="passwordDesc"
            />
            <p id="passwordDesc" className="text-xs text-neutral text-center">
              Sua senha deve ser diferente de sua senha padrão.
            </p>
            <p className="text-xs font-extrabold text-secondary-150">
              {formErrors}
            </p>
            <Button type="submit">TROCAR SENHA</Button>
          </form>
        </main>
      </div>
    </div>
  );
}
