import { auth } from "@/auth";

export async function getFormUser() {
  const session = await auth();
  const name = session?.user?.name?.trim() || "";
  const email = session?.user?.email?.trim() || "";
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    signedIn: Boolean(session?.user),
    name,
    email,
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}
