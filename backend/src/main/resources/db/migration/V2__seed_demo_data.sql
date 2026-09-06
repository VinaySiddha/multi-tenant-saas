-- Seed Roles
INSERT INTO roles (id, name, description, is_deleted, version, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'PLATFORM_ADMIN', 'Platform Super Administrator', false, 0, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'RESTAURANT_OWNER', 'Restaurant Owner and Superuser', false, 0, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'BRANCH_MANAGER', 'Branch General Manager', false, 0, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'CASHIER', 'POS Cashier & Billing', false, 0, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'WAITER', 'Floor Service & Order Captain', false, 0, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'CHEF', 'Kitchen Head Chef & KDS operator', false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Restaurant (The Royal Bistro)
INSERT INTO restaurants (id, name, slug, email, phone_number, address, subscription_plan, subscription_status, is_active, is_deleted, version, created_at, updated_at)
VALUES (
  '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  'The Royal Bistro',
  'royal-bistro',
  'owner@royalbistro.com',
  '+91 98765 43210',
  '100 Feet Road, Indiranagar, Bengaluru, KA 560038',
  'ENTERPRISE',
  'ACTIVE',
  true,
  false,
  0,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Seed Demo Branches
INSERT INTO branches (id, tenant_id, name, code, city, state, currency, is_active, is_deleted, version, created_at, updated_at)
VALUES 
  ('7ca85f64-5717-4562-b3fc-2c963f66afa7', '3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Indiranagar Flagship', 'IND-01', 'Bengaluru', 'Karnataka', 'INR', true, false, 0, NOW(), NOW()),
  ('8ca85f64-5717-4562-b3fc-2c963f66afa8', '3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Koramangala Outlet', 'KOR-02', 'Bengaluru', 'Karnataka', 'INR', true, false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Password for demo users: "Admin@123" -> BCrypt: $2a$12$pG7y9jS.u9W2fX7F0O/RReQz9Q8u3eY5Z8U1jF2nK7tW3rQ4mO6aK
INSERT INTO users (id, tenant_id, branch_id, email, password_hash, full_name, phone_number, primary_role, is_active, is_deleted, version, created_at, updated_at)
VALUES 
  ('9ca85f64-5717-4562-b3fc-2c963f66afa9', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'owner@royalbistro.com', '$2a$12$K8kF.qF7k6/5X5T9dK3PKe/Q9p.M0rF.Vv2Z0sF9v8gG8.rQ6z5Wq', 'Alex Mercer', '+91 98765 43210', 'RESTAURANT_OWNER', true, false, 0, NOW(), NOW()),
  ('aca85f64-5717-4562-b3fc-2c963f66afaa', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'cashier@royalbistro.com', '$2a$12$K8kF.qF7k6/5X5T9dK3PKe/Q9p.M0rF.Vv2Z0sF9v8gG8.rQ6z5Wq', 'Rahul Verma', '+91 98765 43211', 'CASHIER', true, false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- User Roles Mapping
INSERT INTO user_roles (user_id, role_id)
VALUES 
  ('9ca85f64-5717-4562-b3fc-2c963f66afa9', '22222222-2222-2222-2222-222222222222'),
  ('aca85f64-5717-4562-b3fc-2c963f66afaa', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, tenant_id, branch_id, name, description, display_order, is_active, is_deleted, version, created_at, updated_at)
VALUES 
  ('bca85f64-5717-4562-b3fc-2c963f66afab', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'Main Course', 'Rich curries & gravies', 1, true, false, 0, NOW(), NOW()),
  ('cca85f64-5717-4562-b3fc-2c963f66afac', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'Breads & Rice', 'Tandoori breads and fragrant biryanis', 2, true, false, 0, NOW(), NOW()),
  ('dca85f64-5717-4562-b3fc-2c963f66afad', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'Starters & Appetizers', 'Crispy finger foods and kebabs', 3, true, false, 0, NOW(), NOW()),
  ('eca85f64-5717-4562-b3fc-2c963f66afae', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'Beverages & Mocktails', 'Refreshing cold and hot drinks', 4, true, false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Menu Items
INSERT INTO menu_items (id, tenant_id, branch_id, category_id, name, description, price, cost_price, tax_rate, is_veg, is_available, preparation_time_minutes, is_deleted, version, created_at, updated_at)
VALUES 
  ('fca85f64-5717-4562-b3fc-2c963f66afaf', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'bca85f64-5717-4562-b3fc-2c963f66afab', 'Paneer Butter Masala', 'Fresh cottage cheese in velvety rich tomato butter gravy', 340.00, 110.00, 5.00, true, true, 15, false, 0, NOW(), NOW()),
  ('0da85f64-5717-4562-b3fc-2c963f66afb0', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'bca85f64-5717-4562-b3fc-2c963f66afab', 'Butter Chicken Masala', 'Smoked chicken tikka tossed in traditional makhani gravy', 420.00, 150.00, 5.00, false, true, 20, false, 0, NOW(), NOW()),
  ('1da85f64-5717-4562-b3fc-2c963f66afb1', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'cca85f64-5717-4562-b3fc-2c963f66afac', 'Butter Garlic Naan', 'Soft clay-oven baked bread glazed with roasted garlic butter', 65.00, 15.00, 5.00, true, true, 8, false, 0, NOW(), NOW()),
  ('2da85f64-5717-4562-b3fc-2c963f66afb2', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'cca85f64-5717-4562-b3fc-2c963f66afac', 'Chicken Dum Biryani', 'Hyderabadi spiced long grain basmati rice with tender chicken', 380.00, 140.00, 5.00, false, true, 18, false, 0, NOW(), NOW()),
  ('3da85f64-5717-4562-b3fc-2c963f66afb3', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'dca85f64-5717-4562-b3fc-2c963f66afad', 'Crispy Corn Pepper Salt', 'Sweet corn kernels tossed with crushed pepper, scallions and garlic', 260.00, 60.00, 5.00, true, true, 10, false, 0, NOW(), NOW()),
  ('4da85f64-5717-4562-b3fc-2c963f66afb4', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'eca85f64-5717-4562-b3fc-2c963f66afae', 'Mango Lassi', 'Chilled creamy yogurt blended with sweet Ratnagiri Alphonso pulp', 120.00, 35.00, 5.00, true, true, 5, false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Dining Tables
INSERT INTO tables (id, tenant_id, branch_id, table_number, section, capacity, status, qr_code_token, is_active, is_deleted, version, created_at, updated_at)
VALUES 
  ('5da85f64-5717-4562-b3fc-2c963f66afb5', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'T-01', 'Ground Floor AC', 4, 'AVAILABLE', 'qr-token-tbl-01', true, false, 0, NOW(), NOW()),
  ('6da85f64-5717-4562-b3fc-2c963f66afb6', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'T-02', 'Ground Floor AC', 2, 'AVAILABLE', 'qr-token-tbl-02', true, false, 0, NOW(), NOW()),
  ('7da85f64-5717-4562-b3fc-2c963f66afb7', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'T-03', 'Rooftop Lounge', 6, 'AVAILABLE', 'qr-token-tbl-03', true, false, 0, NOW(), NOW()),
  ('8da85f64-5717-4562-b3fc-2c963f66afb8', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '7ca85f64-5717-4562-b3fc-2c963f66afa7', 'T-04', 'Rooftop Lounge', 4, 'AVAILABLE', 'qr-token-tbl-04', true, false, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
