-- ============================================================
-- Politiques RLS — V1 simplifiée à 2 rôles : "public" (lecture seule)
-- et "admin" (tout utilisateur authentifié via Supabase Auth).
-- Reprend ta propre recommandation du cahier des charges :
-- pas besoin des 5 rôles distincts dès la V1, on affinera en V2
-- avec des policies supplémentaires basées sur profiles.role.
-- ============================================================

-- Active RLS sur toutes les tables
ALTER TABLE app_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_impacts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers        ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Lecture publique (site vitrine, clé "anon")
-- ------------------------------------------------------------

CREATE POLICY "public_read_app_settings"    ON app_settings    FOR SELECT USING (true);
CREATE POLICY "public_read_projects"        ON projects        FOR SELECT USING (true);
CREATE POLICY "public_read_project_images"  ON project_images  FOR SELECT USING (true);
CREATE POLICY "public_read_project_updates" ON project_updates FOR SELECT USING (true);
CREATE POLICY "public_read_project_impacts" ON project_impacts FOR SELECT USING (true);
CREATE POLICY "public_read_reports"         ON reports         FOR SELECT USING (true);

-- Dépenses en lecture publique : c'est le cœur de la transparence financière
-- (cf. ta recommandation de rendre le justificatif obligatoire côté admin).
CREATE POLICY "public_read_expenses" ON expenses FOR SELECT USING (true);

-- ------------------------------------------------------------
-- Formulaire bénévole : écriture publique, jamais de lecture publique
-- ------------------------------------------------------------

CREATE POLICY "public_insert_volunteers" ON volunteers FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------
-- Dons : jamais de lecture publique nominative (RGPD / vie privée du donateur).
-- Si tu veux un compteur public, utilise `manual_total_collected` dans
-- app_settings plutôt que d'exposer la table `donations` elle-même.
-- ------------------------------------------------------------

CREATE POLICY "public_insert_donations" ON donations FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------
-- Profils : chacun ne voit que sa propre ligne
-- ------------------------------------------------------------

CREATE POLICY "read_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- ------------------------------------------------------------
-- Administration : tout utilisateur authentifié (V1 simplifiée)
-- ------------------------------------------------------------

CREATE POLICY "admin_write_projects"        ON projects        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_write_project_images"  ON project_images  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_write_project_updates" ON project_updates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_write_project_impacts" ON project_impacts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_write_reports"         ON reports         FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_write_expenses"        ON expenses        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_manage_donations"      ON donations       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_manage_volunteers"     ON volunteers      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- app_settings : verrouillée à la ligne id = 1, jamais d'INSERT depuis le client
-- (cf. ta note : le code Next.js/RLS doit empêcher toute nouvelle ligne).
CREATE POLICY "admin_update_app_settings" ON app_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (id = 1);

-- Trigger pour auto-actualiser updated_at à chaque UPDATE (cf. ta remarque)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_app_settings_updated_at
BEFORE UPDATE ON app_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
