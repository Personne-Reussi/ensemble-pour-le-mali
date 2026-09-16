-- Extension UUID (si nécessaire sur PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------
-- 1. PARAMÈTRES DE L'APPLICATION
------------------------------------------------------------

CREATE TABLE app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    online_donations_active BOOLEAN DEFAULT FALSE,
    annual_funding_goal NUMERIC DEFAULT 0,
    manual_total_collected NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO app_settings (
    id,
    online_donations_active,
    annual_funding_goal,
    manual_total_collected
)
VALUES (
    1,
    FALSE,
    0,
    0
);

------------------------------------------------------------
-- 2. PROFILS ADMINISTRATEURS
------------------------------------------------------------

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'admin'
        CHECK (
            role IN (
                'super_admin',
                'admin',
                'project_manager',
                'accountant',
                'communication'
            )
        ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 3. PROJETS
------------------------------------------------------------

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title TEXT NOT NULL,

    description TEXT,

    budget_target NUMERIC NOT NULL,

    current_funding NUMERIC DEFAULT 0,

    physical_progress INTEGER DEFAULT 0
        CHECK (
            physical_progress >= 0
            AND physical_progress <= 100
        ),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'active',
                'completed',
                'archived'
            )
        ),

    location_name TEXT,

    latitude NUMERIC,
    longitude NUMERIC,

    featured_image_url TEXT,

    start_date DATE,

    end_date DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 4. GALERIE PHOTOS DES PROJETS
------------------------------------------------------------

CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    image_url TEXT NOT NULL,

    image_type TEXT DEFAULT 'during'
        CHECK (
            image_type IN (
                'before',
                'during',
                'after'
            )
        ),

    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 5. ACTUALITÉS / TIMELINE DES PROJETS
------------------------------------------------------------

CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    image_url TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 6. DÉPENSES
------------------------------------------------------------

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    amount NUMERIC NOT NULL,

    description TEXT NOT NULL,

    document_url TEXT,

    expense_date DATE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 7. DONS
------------------------------------------------------------

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    donor_name TEXT DEFAULT 'Anonyme',

    amount NUMERIC NOT NULL,

    payment_method TEXT,

    status TEXT NOT NULL DEFAULT 'validated'
        CHECK (
            status IN (
                'pending',
                'validated',
                'failed'
            )
        ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 8. INDICATEURS D'IMPACT
------------------------------------------------------------

CREATE TABLE project_impacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    metric_name TEXT NOT NULL,

    metric_value INTEGER NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 9. RAPPORTS DE TRANSPARENCE
------------------------------------------------------------

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title TEXT NOT NULL,

    description TEXT,

    report_url TEXT NOT NULL,

    period TEXT,

    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- 10. BÉNÉVOLES
------------------------------------------------------------

CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name TEXT NOT NULL,

    phone TEXT NOT NULL,

    email TEXT,

    skills TEXT,

    availability TEXT,

    message TEXT,

    status TEXT DEFAULT 'new'
        CHECK (
            status IN (
                'new',
                'contacted',
                'active',
                'inactive'
            )
        ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------------------------
-- INDEX RECOMMANDÉS
------------------------------------------------------------

CREATE INDEX idx_projects_status
ON projects(status);

CREATE INDEX idx_expenses_project
ON expenses(project_id);

CREATE INDEX idx_project_updates_project
ON project_updates(project_id);

CREATE INDEX idx_project_images_project
ON project_images(project_id);

CREATE INDEX idx_project_impacts_project
ON project_impacts(project_id);

CREATE INDEX idx_volunteers_status
ON volunteers(status);

CREATE INDEX idx_donations_status
ON donations(status);
