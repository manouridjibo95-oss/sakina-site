import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { intentionId, recipientId, status } = await req.json();

  if (!intentionId || !recipientId || !["accepted", "declined"].includes(status)) {
    return new Response(JSON.stringify({ error: "Paramètres invalides" }), { status: 400 });
  }

  const db = getDatabase();

  const [intention] = await db.sql`
    UPDATE intentions
    SET status = ${status}
    WHERE id = ${intentionId} AND recipient_id = ${recipientId}
    RETURNING id, sender_id, recipient_id, status, created_at
  `;

  if (!intention) {
    return new Response(JSON.stringify({ error: "Intention introuvable" }), { status: 404 });
  }

  return new Response(JSON.stringify({ intention }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/respond-intention",
};
