import { createClient } from "@/lib/supabase/server";
import { IUser, IUserToken } from "@/types";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function getUser() {
  const supabase = await createClient();

  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  const decoded = jwt.verify(token!) as IUserToken;

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", decoded.id);

  if (!data || data.length === 0) {
    redirect("/login");
  }

  if (error) {
    console.error("Error fetching user data:", error);
    redirect("/login");
  }

  const user = data[0] as IUser;

  return user;
}
