import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import { IUser } from "@/type/user";
import { loginSchema } from "@/validation/loginSchema";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email e senha são requeridos." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    const error = validation.error.format();

    return new Response(
      JSON.stringify({
        error: [error.email?._errors, error.password?._errors],
      }),
      {
        status: 400,
      }
    );
  }

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("email", email);

  if (error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });

  if (data === null || data.length === 0)
    return new Response(JSON.stringify({ error: "Usuário não encontrado." }), {
      status: 404,
    });

  const user = data[0] as IUser;

  const passwordIsCorrect = await bcrypt.compare(
    password + user.name,
    user.password
  );

  if (!passwordIsCorrect)
    return new Response(
      JSON.stringify({ error: "Senha ou email incorretos." }),
      {
        status: 401,
      }
    );

  return new Response(
    JSON.stringify({ passwordDefault: user.passworddefault }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
