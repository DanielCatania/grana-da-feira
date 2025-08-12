import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { admin } from "@/lib/supabase/admin";
import { hashPassword } from "@/utils/password";

async function runSeed() {
  const csvPath = path.join(process.cwd(), "scripts", "alunos.csv");
  const file = fs.readFileSync(csvPath);

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ",",
  });

  const passwordDefault = process.env.DEFAULT_PASSWORD;
  if (!passwordDefault)
    throw new Error("The DEFAULT_PASSWORD env is required!");

  for (const row of records) {
    const name = row["Nome Completo"];
    // const birth = row["Data de Nascimento"];
    const email = row["Email"];

    // const [day, month, year] = birth.split("/");
    // const passwordRaw = `${day}${month}${year}`; // ex: "15092006"
    // const hashedPassword = await hashPassword(passwordRaw, name);

    // const birthDateISO = new Date(`${year}-${month}-${day}T00:00:00`);

    const hashedPassword = await hashPassword(passwordDefault, name);

    const { error } = await admin.from("User").insert({
      name,
      email,
      password: hashedPassword,
      // birthdate: birthDateISO.toISOString(),
      passworddefault: true,
      balance: 0,
    });

    if (error) {
      console.error(`Error inserting user with email ${email}:`, error.message);
    } else {
      console.log(`✅ User ${email} inserted successfully.`);
    }
  }
}

runSeed()
  .then(() => console.log("Seed ok."))
  .catch((error) => console.error("Error in seed:", error))
  .finally(() => process.exit(0));
