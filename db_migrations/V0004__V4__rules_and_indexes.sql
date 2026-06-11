CREATE TABLE compatibility_rules (id SERIAL PRIMARY KEY, rule_type VARCHAR(100) NOT NULL, category_a VARCHAR(50) NOT NULL, spec_a VARCHAR(100) NOT NULL, category_b VARCHAR(50) NOT NULL, spec_b VARCHAR(100) NOT NULL, severity VARCHAR(20) NOT NULL DEFAULT 'error', description TEXT NOT NULL);

CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_builds_user_id ON builds(user_id);
CREATE INDEX idx_build_components_build_id ON build_components(build_id);