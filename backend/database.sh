#!/bin/bash

# --- CONFIG ---
DB_NAME="mydb"
DB_USER="myuser"
DB_HOST="localhost"
DB_PORT="5432"

# Optional: Password prompt
# export PGPASSWORD="your_password"

# --- SCRIPT ---
echo "Inserting 10 categories into product_category..."

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<SQL
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
ON CONFLICT (id) DO NOTHING; -- avoids duplicates if run multiple times
SQL

echo "Done!"
