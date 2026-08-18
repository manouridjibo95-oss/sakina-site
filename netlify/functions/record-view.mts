import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const { viewedUserId, viewerId } = await req.json();

  if (!viewedUserId) {
    return new Response(JSON.stringify({ error: "viewedUserId manquant" }), { status: 400 });
  }

  if (viewerId && String(viewerId) === String(viewedUserId)) {
    return new Response(JSON.stringify({ skipped: true }), { status: 200 });
  }

  const db = getDatabase();

  await db.sql`
    UPDATE profiles SET views_count = views_count + 1 WHERE user_id = ${viewedUserId}
  `;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/record-view",
};
