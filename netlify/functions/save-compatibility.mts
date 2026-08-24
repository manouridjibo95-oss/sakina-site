import type { Context, Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { DIMENSIONS, ANSWER_KEYS, NIYYAH, completion } from "../lib/compatibility.mjs";

/** Valeurs acceptées pour chaque question, dérivées du questionnaire. */
const ALLOWED: Record<string, string[]> = {};
for (const dim of DIMENSIONS) {
  for (const q of dim.questions) ALLOWED[q.key] = q.options.map((o) => o.value);
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId manquant" }), { status: 400 });
  }

  // On n'accepte que les valeurs du questionnaire : une réponse inconnue
  // fausserait le score sans jamais être détectable côté affichage.
  const answers: Record<string, string | null> = {};
  for (const key of ANSWER_KEYS) {
    const value = body[key];
    if (value === undefined || value === null || value === "") {
      answers[key] = null;
    } else if (ALLOWED[key].includes(value)) {
      answers[key] = value;
    } else {
      return new Response(
        JSON.stringify({ error: `Réponse invalide pour « ${key} »` }),
        { status: 400 }
      );
    }
  }

  const niyyah =
    typeof body.niyyah === "string" && body.niyyah.trim()
      ? body.niyyah.trim().slice(0, NIYYAH.maxLength)
      : null;

  const db = getDatabase();

  const [profile] = await db.sql`
    UPDATE profiles SET
      prayer = ${answers.prayer},
      marriage_timeline = ${answers.marriage_timeline},
      children_wish = ${answers.children_wish},
      relocation = ${answers.relocation},
      family_view = ${answers.family_view},
      temperament = ${answers.temperament},
      niyyah = ${niyyah}
    WHERE user_id = ${userId}
    RETURNING user_id, prayer, marriage_timeline, children_wish,
              relocation, family_view, temperament, niyyah
  `;

  if (!profile) {
    return new Response(
      JSON.stringify({ error: "Créez d'abord votre profil avant de renseigner vos affinités." }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ profile, completion: completion(profile) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/save-compatibility",
};
