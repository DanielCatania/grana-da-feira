import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  // Select a test user from the User table
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", "b3a81a02-2558-4e0b-81bb-5afef6772b28");

  if (process.env.NODE_ENV !== "production") console.log(data);
  console.error(error);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response("pong", { status: 200 });
}
