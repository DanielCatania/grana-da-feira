// import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/validation/loginSchema";

export async function POST(request: Request) {
  // const supabase = await createClient();

  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

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

  // connection with database...

  return new Response(JSON.stringify({ message: "Login successful", email }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
