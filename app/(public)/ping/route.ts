import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  // Select a test user from the User table
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("email", "catania@escola.com");

  if (process.env.NODE_ENV !== "production" && data !== null)
    console.log(data[0]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response("pong", { status: 200 });
}
