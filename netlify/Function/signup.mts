import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import bcrypt from "bcryptjs";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return new Response(
      JSON.stringify({ error: "Email valide et mot de passe d'au moins 8 caractères requis" }),
      { status: 400 }
    );
  }

  const db = getDatabase();

  const existing = await db.sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return new Response(JSON.stringify({ error: "Un compte existe déjà avec cet email" }), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db.sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email, created_at
  `;

  return new Response(JSON.stringify({ user: newUser }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/signup",
};
