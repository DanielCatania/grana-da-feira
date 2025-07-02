import { createClient } from "@/lib/supabase/server";
import { IUser, IUserToken } from "@/types";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";
import { formatDateToPassword, hashPassword } from "@/utils/password";
import bcrypt from "bcrypt";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const { password } = await request.json();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return new Response(JSON.stringify({ error: "Token é requerido." }), {
      status: 400,
    });

  const decoded = jwt.verify(token) as IUserToken;

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", decoded.id);

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  if (data === null || data.length === 0)
    return new Response(JSON.stringify({ error: "Usuário não encontrado." }), {
      status: 404,
    });

  const user = data[0] as IUser;

  if (formatDateToPassword(user.birthdate) === password)
    return new Response(
      JSON.stringify({
        error: "A nova senha não pode ser igual a senha padrão.",
      }),
      { status: 400 }
    );

  const isTheSame = await bcrypt.compare(password + user.name, user.password);

  if (isTheSame)
    return new Response(
      JSON.stringify({ error: "A nova senha não pode ser igual a atual." }),
      { status: 400 }
    );

  const hashedPassword = await hashPassword(password, user.name);

  const { data: updateData, error: updateError } = (await supabase
    .from("User")
    .update({
      password: hashedPassword,
      passworddefault: false,
    })
    .eq("id", decoded.id)
    .select("*")) as { data: IUser[] | null; error: { message: string } };

  if (updateError)
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
    });

  const updatedUser = updateData![0] as IUser;

  const newToken = jwt.sign(
    {
      id: updatedUser.id,
      name: updatedUser.name,
      passwordDefault: updatedUser.passworddefault,
      birthdate: formatDateToPassword(updatedUser.birthdate),
    },
    { expiresIn: "2d" }
  );

  cookieStore.set("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 2, // 2 dias
  });

  return new Response(
    JSON.stringify({
      message: "Senha trocada com sucesso",
    })
  );
}
