import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import { IUser } from "@/type/user";
import { loginSchema } from "@/validation/loginSchema";
import cookie from "cookie";
import jwt from "@/lib/jwt";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { email, password } = await request.json();

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
    return new Response(JSON.stringify({ error: error.message }), {
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

  const token = jwt.sign({ id: user.id, name: user.name }, { expiresIn: "2d" });

  return new Response(
    JSON.stringify({
      message: "Login realizado com sucesso.",
      passwordDefault: user.passworddefault,
    }),
    {
      headers: {
        "Set-Cookie": cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 2, // 2 days
        }),
        "Content-Type": "application/json",
      },
    }
  );
}
