-- Historique nominatif des visites de profil (« Ils ont consulté mon profil »)
CREATE TABLE IF NOT EXISTS profile_views (
  id SERIAL PRIMARY KEY,
  viewed_user_id INTEGER NOT NULL REFERENCES users(id),
  viewer_id INTEGER NOT NULL REFERENCES users(id),
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (viewed_user_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS profile_views_viewed_idx
  ON profile_views (viewed_user_id, viewed_at DESC);

-- Statut Premium : débloque l'identité complète des visiteurs
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP;
