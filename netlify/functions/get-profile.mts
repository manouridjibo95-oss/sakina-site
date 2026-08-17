import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId manquant" }), { status: 400 });
  }

  const db = getDatabase();

  const [profile] = await db.sql`
    SELECT first_name, age, city, gender, practice, bio, wali_name, wali_contact
    FROM profiles
    WHERE user_id = ${userId}
  `;

  return new Response(JSON.stringify({ profile: profile || null }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/get-profile",
};
