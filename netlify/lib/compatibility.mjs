/**
 * Source unique de vérité du système de compatibilité.
 * Utilisé par les fonctions serveur pour le calcul, et servi au client
 * pour afficher le questionnaire — afin que libellés et clés ne divergent jamais.
 */

/** Les axes mesurés, leur poids relatif et leurs questions. */
export const DIMENSIONS = [
  {
    key: "foi",
    label: "Pratique religieuse",
    weight: 30,
    hint: "L'axe le plus déterminant pour un mariage serein.",
    questions: [
      {
        key: "prayer",
        label: "Où en êtes-vous avec la prière ?",
        scale: true,
        options: [
          { value: "assidu", label: "J'accomplis les cinq prières" },
          { value: "regulier", label: "Je prie régulièrement, avec des manques" },
          { value: "apprentissage", label: "Je suis en chemin, j'apprends" },
        ],
      },
    ],
  },
  {
    key: "projet",
    label: "Projet de mariage",
    weight: 25,
    hint: "Deux personnes sincères mais aux rythmes opposés se heurtent vite.",
    questions: [
      {
        key: "marriage_timeline",
        label: "Dans quel délai envisagez-vous de vous marier ?",
        scale: true,
        options: [
          { value: "six_mois", label: "Dans les six mois" },
          { value: "cette_annee", label: "Dans l'année" },
          { value: "sans_hate", label: "Sans précipitation, le moment venu" },
        ],
      },
      {
        key: "children_wish",
        label: "Et concernant les enfants ?",
        scale: true,
        options: [
          { value: "oui_bientot", label: "J'en souhaite, assez tôt" },
          { value: "oui_plus_tard", label: "J'en souhaite, plus tard" },
          { value: "deja", label: "J'ai déjà des enfants" },
        ],
      },
    ],
  },
  {
    key: "cadre",
    label: "Cadre de vie",
    weight: 20,
    hint: "La question la plus concrète, et la plus souvent oubliée.",
    questions: [
      {
        key: "relocation",
        label: "Seriez-vous prêt(e) à déménager pour votre foyer ?",
        scale: true,
        options: [
          { value: "oui", label: "Oui, y compris à l'étranger" },
          { value: "pays", label: "Oui, dans mon pays" },
          { value: "non", label: "Je souhaite rester dans ma ville" },
        ],
      },
    ],
  },
  {
    key: "foyer",
    label: "Vision du foyer",
    weight: 15,
    hint: "Comment vous imaginez la répartition du quotidien.",
    questions: [
      {
        key: "family_view",
        label: "Quelle organisation vous correspond ?",
        scale: true,
        options: [
          { value: "traditionnel", label: "Une répartition traditionnelle des rôles" },
          { value: "equilibre", label: "Un équilibre à parts égales" },
          { value: "a_definir", label: "À définir ensemble, sans a priori" },
        ],
      },
    ],
  },
  {
    key: "caractere",
    label: "Tempérament",
    weight: 10,
    hint: "Indicatif : les caractères différents se complètent souvent.",
    questions: [
      {
        key: "temperament",
        label: "Comment vous décririez-vous ?",
        scale: false,
        options: [
          { value: "reserve", label: "Posé(e) et réservé(e)" },
          { value: "entre_deux", label: "Entre les deux, selon les moments" },
          { value: "sociable", label: "Expressif(ve) et sociable" },
        ],
      },
    ],
  },
];

/** Toutes les clés de réponse, à plat. */
export const ANSWER_KEYS = DIMENSIONS.flatMap((d) => d.questions.map((q) => q.key));

/** Le champ libre accompagnant le questionnaire. */
export const NIYYAH = {
  key: "niyyah",
  label: "Votre niyyah",
  hint: "L'intention avec laquelle vous entamez cette démarche. Elle sera visible sur votre profil.",
  maxLength: 400,
};

/**
 * Part minimale du poids total qui doit être renseignée de part et d'autre
 * pour qu'un score ait un sens. En dessous, on ne montre pas de chiffre.
 */
export const MIN_COVERAGE = 60;

/** Position d'une valeur dans l'échelle d'une question (-1 si absente). */
function rank(question, value) {
  return question.options.findIndex((o) => o.value === value);
}

/**
 * Score d'une question, de 0 à 100.
 * Échelle ordonnée : l'écart entre les positions détermine la note.
 * Échelle non ordonnée : l'identité rapproche, la différence reste bien notée.
 */
function scoreQuestion(question, a, b) {
  const ra = rank(question, a);
  const rb = rank(question, b);
  if (ra === -1 || rb === -1) return null; // réponse manquante : question ignorée

  const gap = Math.abs(ra - rb);

  if (question.scale) {
    const span = question.options.length - 1;
    return Math.round(100 - (gap / span) * 80); // 100 / 60 / 20 sur trois paliers
  }
  return gap === 0 ? 100 : gap === 1 ? 88 : 80;
}

/** Le cadre de vie combine la réponse « mobilité » et la ville réelle. */
function scoreCadre(profileA, profileB, baseScore) {
  const sameCity =
    profileA.city &&
    profileB.city &&
    profileA.city.trim().toLowerCase() === profileB.city.trim().toLowerCase();

  if (sameCity) return 100;
  if (baseScore === null) return null;

  // Villes différentes : la disposition à déménager fait toute la différence.
  const mobile = (p) => p.relocation === "oui" || p.relocation === "pays";
  if (mobile(profileA) || mobile(profileB)) return Math.round(baseScore * 0.85);
  return Math.min(baseScore, 40);
}

/**
 * Compare deux profils.
 * @returns {{score: number|null, answered: number, total: number, breakdown: Array}}
 */
export function compareProfiles(profileA, profileB) {
  const breakdown = [];
  let weighted = 0;
  let usedWeight = 0;
  let answered = 0;
  let total = 0;

  for (const dim of DIMENSIONS) {
    const parts = [];
    for (const q of dim.questions) {
      total += 1;
      const s = scoreQuestion(q, profileA[q.key], profileB[q.key]);
      if (s !== null) {
        answered += 1;
        parts.push(s);
      }
    }

    let dimScore = parts.length ? Math.round(parts.reduce((x, y) => x + y, 0) / parts.length) : null;
    if (dim.key === "cadre") dimScore = scoreCadre(profileA, profileB, dimScore);

    breakdown.push({
      key: dim.key,
      label: dim.label,
      weight: dim.weight,
      hint: dim.hint,
      score: dimScore,
    });

    if (dimScore !== null) {
      weighted += dimScore * dim.weight;
      usedWeight += dim.weight;
    }
  }

  const coverage = usedWeight; // part du poids total réellement mesurée

  return {
    // Un score calculé sur trop peu de réponses induirait en erreur :
    // deux profils qui n'ont qu'une question en commun afficheraient 100 %.
    score: coverage >= MIN_COVERAGE ? Math.round(weighted / usedWeight) : null,
    reliable: coverage >= MIN_COVERAGE,
    coverage,
    answered,
    total,
    breakdown,
  };
}

/** Combien de questions un profil a renseignées. */
export function completion(profile) {
  const done = ANSWER_KEYS.filter((k) => profile && profile[k]).length;
  return { done, total: ANSWER_KEYS.length };
}

/** Libellé qualitatif d'un score — jamais présenté comme une vérité absolue. */
export function scoreLabel(score) {
  if (score === null || score === undefined) return "Non calculé";
  if (score >= 85) return "Très proche";
  if (score >= 70) return "Proche";
  if (score >= 50) return "Des points communs";
  return "Des différences notables";
}
