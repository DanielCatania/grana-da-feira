import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { admin } from "@/lib/supabase/admin";
import { hashPassword } from "@/utils/password";

export async function runSeed() {
  const csvPath = path.join(process.cwd(), "scripts", "alunos.csv");
  const file = fs.readFileSync(csvPath);

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ",",
  });

  const passwordDefault = process.env.DEFAULT_PASSWORD;
  if (!passwordDefault) {
    throw new Error("The DEFAULT_PASSWORD env is required!");
  }

  const users = await Promise.all(
    records.map(async (row: { "Nome Completo": string; Email: string }) => {
      const name = row["Nome Completo"];
      const email = row["Email"];

      const hashedPassword = await hashPassword(passwordDefault, name);

      return {
        name,
        email,
        password: hashedPassword,
        passworddefault: true,
        balance: 0,
      };
    })
  );

  const batchSize = 100;
  for (let i = 0; i < users.length; i += batchSize) {
    const chunk = users.slice(i, i + batchSize);

    const { error } = await admin
      .from("User")
      .upsert(chunk, { onConflict: "email" });

    if (error) {
      console.error(
        `❌ Erro ao inserir batch ${i / batchSize + 1}:`,
        error.message
      );
    } else {
      console.log(`✅ Batch ${i / batchSize + 1} inserido com sucesso.`);
    }
  }
}

// runSeed()
//   .then(() => console.log("🌱 Seed finalizada com sucesso."))
//   .catch((error) => console.error("❌ Erro na seed:", error))
//   .finally(() => process.exit(0));

export const getAllUsers = async () => {
  const { data, error } = await admin.from("User").select("*");

  if (error) {
    console.error("❌ Erro ao buscar usuários:", error.message);
    return;
  }

  console.log("Número total de usuários:", data?.length);
  return data;
};

getAllUsers()
  .then(() => console.log("🌱 Operação finalizada com sucesso."))
  .catch((error) => console.error("❌ Erro na operação:", error))
  .finally(() => process.exit(0));
