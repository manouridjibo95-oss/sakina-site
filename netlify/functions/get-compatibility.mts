import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import {
  DIMENSIONS,
  NIYYAH,
  MIN_COVERAGE,
  compareProfiles,
  completion,
  scoreLabel,
} from "../lib/compatibility.mjs";

const FIELDS = `user_id, first_name, city, gender, prayer, marriage_timeline,
  children_wish, relocation, family_view, temperament, niyyah`;

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const targetId = url.searchParams.get("targetId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId manquant" }), { status: 400 });
  }

  const db = getDatabase();

  const [me] = await db.sql`
    SELECT user_id, first_name, city, gender, prayer, marriage_timeline,
           children_wish, relocation, family_view, temperament, niyyah
    FROM profiles WHERE user_id = ${userId}
  `;

  // Le questionnaire lui-même : servi depuis le serveur pour que les libellés
  // et les clés de réponse ne puissent jamais diverger du calcul.
  const payload: Record<string, unknown> = {
    dimensions: DIMENSIONS,
    niyyahField: NIYYAH,
    minCoverage: MIN_COVERAGE,
    answers: me || null,
    completion: completion(me || {}),
  };

  if (targetId) {
    const [target] = await db.sql`
      SELECT user_id, first_name, city, gender, prayer, marriage_timeline,
             children_wish, relocation, family_view, temperament, niyyah
      FROM profiles WHERE user_id = ${targetId}
    `;

    if (!me || !target) {
      payload.comparison = null;
      payload.reason = !me ? "profil-incomplet" : "cible-introuvable";
    } else {
      const result = compareProfiles(me, target);
      payload.comparison = { ...result, label: scoreLabel(result.score) };
    }
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/get-compatibility",
};
