import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const withId = url.searchParams.get("withId");

  if (!userId || !withId) {
    return new Response(JSON.stringify({ error: "Paramètres manquants" }), { status: 400 });
  }

  const db = getDatabase();

  const messages = await db.sql`
    SELECT id, sender_id, recipient_id, content, created_at
    FROM messages
    WHERE (sender_id = ${userId} AND recipient_id = ${withId})
       OR (sender_id = ${withId} AND recipient_id = ${userId})
    ORDER BY created_at ASC
    LIMIT 200
  `;

  return new Response(JSON.stringify({ messages }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/get-messages",
};
