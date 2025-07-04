import jwt from "@/lib/jwt";
import { createClient } from "@/lib/supabase/server";
import { DecodedAdminToken } from "@/types";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token) as DecodedAdminToken;

  if (!decoded || !decoded.adminAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const isValidAdmin = await bcrypt.compare(
    process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!,
    decoded.adminAccess
  );

  if (!isValidAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.trim().length < 2) {
    return Response.json({ users: [] });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("User")
    .select("name, id")
    .ilike("name", `%${query}%`);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ users: data });
}
