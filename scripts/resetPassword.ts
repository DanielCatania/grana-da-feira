import { admin } from "@/lib/supabase/admin";
import { hashPassword } from "@/utils/password";

async function resetUserPassword(email: string): Promise<void> {
  const passwordDefault = process.env.DEFAULT_PASSWORD;
  if (!passwordDefault) {
    throw new Error("The DEFAULT_PASSWORD env is required!");
  }

  const { data: user, error: fetchError } = await admin
    .from("User")
    .select("*")
    .eq("email", email)
    .single();

  if (fetchError) {
    console.error(`❌ Erro ao buscar o usuário ${email}:`, fetchError.message);
    return;
  }

  if (!user) {
    console.error(`❌ Usuário com e-mail ${email} não encontrado.`);
    return;
  }

  const hashedPassword = await hashPassword(passwordDefault, user.name);

  const { error: updateError } = await admin
    .from("User")
    .update({
      password: hashedPassword,
      passworddefault: true,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error(`❌ Erro ao resetar senha de ${email}:`, updateError.message);
  } else {
    console.log(`✅ Senha de ${email} resetada com sucesso.`);
  }
}

const emailToReset = process.argv[2];
if (!emailToReset) {
  console.error("❌ Informe o e-mail do usuário como argumento.");
  process.exit(1);
}

resetUserPassword(emailToReset)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erro geral:", err);
    process.exit(1);
  });
