import { useState } from "react";
import Input, { InputProps } from "..";

type PasswordInputProps = InputProps<string> & { desc: string };

export default function PasswordInput({ state, desc }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full flex flex-col items-center">
      <label htmlFor="password" className="sr-only">
        Digite sua senha
      </label>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Senha"
        id="password"
        required
        state={state}
        aria-describedby="passwordDesc"
      />
      <p id="passwordDesc" className="text-xs text-neutral text-center">
        {desc}
      </p>
      <button
        type="button"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        className="absolute right-10 top-[15%] select-none"
      >
        {showPassword ? "🫣" : "👀"}
      </button>
    </div>
  );
}
