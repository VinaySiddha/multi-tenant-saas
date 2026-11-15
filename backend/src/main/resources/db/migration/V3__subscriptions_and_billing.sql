-- V3__subscriptions_and_billing.sql
-- Create subscription management and billing infrastructure

-- 1. Plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10, 2) NOT NULL,
    annual_price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    max_outlets INT NOT NULL DEFAULT 1,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Plan Features table
CREATE TABLE IF NOT EXISTS plan_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    feature_key VARCHAR(100) NOT NULL,
    feature_name VARCHAR(150) NOT NULL,
    is_included BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    plan_code VARCHAR(50) NOT NULL DEFAULT 'GROWTH',
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    status VARCHAR(30) NOT NULL DEFAULT 'TRIALING',
    trial_start_at TIMESTAMP WITH TIME ZONE,
    trial_end_at TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    provider VARCHAR(50),
    provider_subscription_id VARCHAR(100),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_subscription UNIQUE (tenant_id)
);

-- 4. Subscription Items (Add-ons or custom quantities)
CREATE TABLE IF NOT EXISTS subscription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    invoice_number VARCHAR(60) NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'PAID',
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    invoice_pdf_url VARCHAR(500),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL,
    provider_payment_id VARCHAR(100),
    provider_order_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Webhook Events table (for idempotency and retry-safe provider handling)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    event_id VARCHAR(150) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PROCESSED',
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_provider_event UNIQUE (provider, event_id)
);

-- 8. Subscription Audit Logs table
CREATE TABLE IF NOT EXISTS subscription_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    from_plan VARCHAR(50),
    to_plan VARCHAR(50),
    actor VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Plans
INSERT INTO plans (id, code, name, description, monthly_price, annual_price, currency, max_outlets, is_popular, is_active, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111001', 'starter', 'Starter', 'Essential POS and billing for single-outlet independent restaurants.', 999.00, 9990.00, 'INR', 1, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111002', 'growth', 'Growth', 'Full-featured operational suite including KDS, QR ordering, and advanced analytics.', 1999.00, 19990.00, 'INR', 1, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('11111111-1111-1111-1111-111111111003', 'multi_outlet', 'Multi-Outlet', 'Enterprise multi-branch management with centralized menus, reporting, and administration.', 3999.00, 39990.00, 'INR', 5, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- Seed Plan Features
INSERT INTO plan_features (id, plan_id, feature_key, feature_name, is_included) VALUES
    -- Starter
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'core_pos', 'Core POS & Billing', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'menu_mgmt', 'Menu & Categories', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'basic_reports', 'Basic Sales Reports', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'one_outlet', '1 Restaurant Outlet', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'kds', 'Kitchen Display System (KDS)', FALSE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111001', 'qr_ordering', 'QR Ordering & Tables', FALSE),
    
    -- Growth
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'core_pos', 'Core POS & Billing', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'menu_mgmt', 'Menu & Categories', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'kds', 'Kitchen Display System (KDS)', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'qr_ordering', 'QR Ordering & Table Management', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'staff_roles', 'Staff Roles & Permissions', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'advanced_reports', 'Advanced Analytics & Exports', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111002', 'support', 'Priority Email & Chat Support', TRUE),

    -- Multi-Outlet
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111003', 'everything_growth', 'Everything in Growth', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111003', 'multi_branch', 'Multi-Branch Management', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111003', 'centralized_menu', 'Centralized Menu & Global Pricing', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111003', 'branch_permissions', 'Branch-Level Scoped Permissions', TRUE),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111003', 'advanced_admin', 'Advanced Administration & Audit Trail', TRUE)
ON CONFLICT DO NOTHING;

-- Initialize default 14-day trial subscriptions for existing restaurants that don't have one
INSERT INTO subscriptions (tenant_id, plan_id, plan_code, status, trial_start_at, trial_end_at, current_period_start, current_period_end)
SELECT 
    r.id,
    '11111111-1111-1111-1111-111111111002',
    'growth',
    'TRIALING',
    COALESCE(r.created_at, CURRENT_TIMESTAMP),
    COALESCE(r.subscription_ends_at, CURRENT_TIMESTAMP + INTERVAL '14 days'),
    COALESCE(r.created_at, CURRENT_TIMESTAMP),
    COALESCE(r.subscription_ends_at, CURRENT_TIMESTAMP + INTERVAL '14 days')
FROM restaurants r
WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions s WHERE s.tenant_id = r.id
)
ON CONFLICT (tenant_id) DO NOTHING;
