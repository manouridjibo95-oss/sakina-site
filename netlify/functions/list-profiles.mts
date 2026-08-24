import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { compareProfiles, scoreLabel } from "../lib/compatibility.mjs";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const db = getDatabase();

  const viewer = userId
    ? (
        await db.sql`
          SELECT user_id, first_name, city, gender, prayer, marriage_timeline,
                 children_wish, relocation, family_view, temperament
          FROM profiles WHERE user_id = ${userId}
        `
      )[0]
    : null;

  // Un site matrimonial ne doit montrer ni votre propre fiche, ni des profils
  // du même genre. Sans profil visiteur connu, on ne peut pas filtrer.
  const profiles = viewer
    ? await db.sql`
        SELECT user_id, first_name, age, city, gender, practice, bio, wali_name, photo_data,
               prayer, marriage_timeline, children_wish, relocation, family_view,
               temperament, niyyah
        FROM profiles
        WHERE user_id <> ${viewer.user_id}
          AND gender <> ${viewer.gender}
        ORDER BY created_at DESC
        LIMIT 50
      `
    : await db.sql`
        SELECT user_id, first_name, age, city, gender, practice, bio, wali_name, photo_data,
               prayer, marriage_timeline, children_wish, relocation, family_view,
               temperament, niyyah
        FROM profiles
        ORDER BY created_at DESC
        LIMIT 50
      `;

  const enriched = viewer
    ? profiles.map((p: Record<string, unknown>) => {
        const result = compareProfiles(viewer, p);
        return {
          ...p,
          compatibility: {
            score: result.score,
            reliable: result.reliable,
            coverage: result.coverage,
            label: scoreLabel(result.score),
          },
        };
      })
    : profiles;

  // Les meilleures affinités d'abord, les profils non évalués ensuite.
  if (viewer) {
    enriched.sort(
      (a: any, b: any) => (b.compatibility.score ?? -1) - (a.compatibility.score ?? -1)
    );
  }

  return new Response(JSON.stringify({ profiles: enriched, filtered: Boolean(viewer) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/list-profiles",
};
