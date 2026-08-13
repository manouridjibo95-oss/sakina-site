import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { senderId, recipientId, content } = await req.json();

  if (!senderId || !recipientId || !content || !content.trim()) {
    return new Response(JSON.stringify({ error: "Message vide ou destinataire manquant" }), { status: 400 });
  }

  const db = getDatabase();

  const [message] = await db.sql`
    INSERT INTO messages (sender_id, recipient_id, content)
    VALUES (${senderId}, ${recipientId}, ${content.trim()})
    RETURNING id, sender_id, recipient_id, content, created_at
  `;

  return new Response(JSON.stringify({ message }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/send-message",
};
