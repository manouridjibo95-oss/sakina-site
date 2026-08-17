import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const db = getDatabase();

  const profiles = await db.sql`
    SELECT user_id, first_name, age, city, gender, practice, bio, wali_name, photo_data
    FROM profiles
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return new Response(JSON.stringify({ profiles }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/list-profiles",
};
