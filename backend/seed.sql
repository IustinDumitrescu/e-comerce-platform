INSERT INTO product_category (id, name, created_at, updated_at) VALUES
(1, 'Electronics', NOW(), NOW()),
(2, 'Books', NOW(), NOW()),
(3, 'Clothing', NOW(), NOW()),
(4, 'Home & Kitchen', NOW(), NOW()),
(5, 'Toys & Games', NOW(), NOW()),
(6, 'Sports & Outdoors', NOW(), NOW()),
(7, 'Beauty & Personal Care', NOW(), NOW()),
(8, 'Automotive', NOW(), NOW()),
(9, 'Health', NOW(), NOW()),
(10, 'Garden', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;