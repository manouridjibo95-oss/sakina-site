import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { userId, firstName, age, city, gender, practice, bio } = await req.json();

  if (!userId || !firstName || !age || !city || !gender) {
    return new Response(
      JSON.stringify({ error: "Prénom, âge, ville et genre sont obligatoires" }),
      { status: 400 }
    );
  }

  const db = getDatabase();

  const [profile] = await db.sql`
    INSERT INTO profiles (user_id, first_name, age, city, gender, practice, bio)
    VALUES (${userId}, ${firstName}, ${age}, ${city}, ${gender}, ${practice || null}, ${bio || null})
    ON CONFLICT (user_id)
    DO UPDATE SET
      first_name = EXCLUDED.first_name,
      age = EXCLUDED.age,
      city = EXCLUDED.city,
      gender = EXCLUDED.gender,
      practice = EXCLUDED.practice,
      bio = EXCLUDED.bio
    RETURNING id, first_name, age, city, gender, practice, bio
  `;

  return new Response(JSON.stringify({ profile }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/create-profile",
};
