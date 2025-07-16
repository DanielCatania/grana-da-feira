import { createClient } from "@/lib/supabase/server";
import checkIsAdmin from "@/utils/isAdmin";

export async function GET(request: Request) {
  const isAdmin = await checkIsAdmin();

  if (isAdmin !== true) {
    return isAdmin;
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
