import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import bcrypt from "bcryptjs";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email et mot de passe requis" }), { status: 400 });
  }

  const db = getDatabase();
  const [user] = await db.sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;

  if (!user) {
    return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
  }

  return new Response(JSON.stringify({ user: { id: user.id, email: user.email } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/login",
};
