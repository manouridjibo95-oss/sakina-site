import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const FREE_PREVIEW = 3;   // aperçu offert aux comptes gratuits
const PREMIUM_LIMIT = 30; // profondeur de l'historique pour les membres Premium

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

  try {
    const [account] = await db.sql`SELECT is_premium FROM users WHERE id = ${userId}`;
    if (!account) {
      return new Response(JSON.stringify({ error: "Compte introuvable" }), { status: 404 });
    }

    const isPremium = account.is_premium === true;
    const limit = isPremium ? PREMIUM_LIMIT : FREE_PREVIEW;

    const [totals] = await db.sql`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days')::int AS week
      FROM profile_views
      WHERE viewed_user_id = ${userId}
    `;

    const rows = await db.sql`
      SELECT v.viewer_id, v.viewed_at, p.first_name, p.age, p.city, p.photo_data
      FROM profile_views v
      LEFT JOIN profiles p ON p.user_id = v.viewer_id
      WHERE v.viewed_user_id = ${userId}
      ORDER BY v.viewed_at DESC
      LIMIT ${limit}
    `;

    // Les comptes gratuits voient qui est passé, sans pouvoir ouvrir le profil :
    // l'identifiant n'est donc jamais envoyé au navigateur dans ce cas.
    const visitors = rows.map((row: any) => ({
      userId: isPremium ? row.viewer_id : null,
      firstName: row.first_name || "Un membre",
      age: isPremium ? row.age ?? null : null,
      city: isPremium ? row.city || null : null,
      photo: row.photo_data || null,
      viewedAt: row.viewed_at,
      locked: !isPremium,
    }));

    return new Response(
      JSON.stringify({
        isPremium,
        total: totals?.total ?? 0,
        week: totals?.week ?? 0,
        shown: visitors.length,
        visitors,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("get-visitors", error);
    return new Response(JSON.stringify({ error: "Vos visiteurs n'ont pas pu être chargés" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/get-visitors",
};
