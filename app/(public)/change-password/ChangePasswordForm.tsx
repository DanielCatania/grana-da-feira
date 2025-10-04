"use client";
import Button from "@/components/Button";
import PasswordInput from "@/components/Input/Password";
import safeFetch from "@/utils/safeFetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [formErrors, setFormErrors] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8)
      return setFormErrors("A senha deve ter no mínimo 8 caracteres");

    const passwordDefault = process.env.DEFAULT_PASSWORD;

    if (passwordDefault && password === passwordDefault)
      return setFormErrors("A senha deve ser diferente da senha padrão");

    const response = await (
      await safeFetch(`/api/change-password`, {
        body: JSON.stringify({
          password,
        }),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    ).json();

    if (response.error) return setFormErrors(response.error);

    setFormErrors("");

    router.push("/");
  };

  return (
    <>
      <h1 className="text-center text-4xl m-4 text-primary-150">Mudar senha</h1>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        <PasswordInput
          desc="Sua senha deve ser diferente de sua senha padrão."
          state={{ value: password, set: setPassword }}
        />
        <p className="text-xs font-extrabold text-secondary-150">
          {formErrors}
        </p>
        <Button type="submit">TROCAR SENHA</Button>
      </form>
    </>
  );
}
