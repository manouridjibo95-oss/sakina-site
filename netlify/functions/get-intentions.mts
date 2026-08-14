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

  const received = await db.sql`
    SELECT i.id, i.status, i.created_at, u.id AS user_id,
           COALESCE(p.first_name, u.email) AS first_name, p.age, p.city
    FROM intentions i
    JOIN users u ON u.id = i.sender_id
    LEFT JOIN profiles p ON p.user_id = i.sender_id
    WHERE i.recipient_id = ${userId}
    ORDER BY i.created_at DESC
  `;

  const sent = await db.sql`
    SELECT i.id, i.status, i.created_at, u.id AS user_id,
           COALESCE(p.first_name, u.email) AS first_name, p.age, p.city
    FROM intentions i
    JOIN users u ON u.id = i.recipient_id
    LEFT JOIN profiles p ON p.user_id = i.recipient_id
    WHERE i.sender_id = ${userId}
    ORDER BY i.created_at DESC
  `;

  return new Response(JSON.stringify({ received, sent }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/get-intentions",
};
