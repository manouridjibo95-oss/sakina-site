import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { senderId, recipientId } = await req.json();

  if (!senderId || !recipientId) {
    return new Response(JSON.stringify({ error: "Destinataire manquant" }), { status: 400 });
  }

  const db = getDatabase();

  const existing = await db.sql`
    SELECT id FROM intentions WHERE sender_id = ${senderId} AND recipient_id = ${recipientId}
  `;
  if (existing.length > 0) {
    return new Response(JSON.stringify({ error: "Intention déjà envoyée" }), { status: 409 });
  }

  const [intention] = await db.sql`
    INSERT INTO intentions (sender_id, recipient_id, status)
    VALUES (${senderId}, ${recipientId}, 'pending')
    RETURNING id, sender_id, recipient_id, status, created_at
  `;

  return new Response(JSON.stringify({ intention }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/send-intention",
};
