import bcrypt from "bcrypt";

export async function hashPassword(
  value: string,
  salt: string
): Promise<string> {
  const hashedPassword = await bcrypt.hash(value + salt, 10);
  return hashedPassword;
}

export function formatDateToPassword(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  return `${day}${month}${year}`;
}
