-- Database Structure Overview
-- Shows table details and relationships

-- List all tables with row counts
SELECT 
    schemaname as schema,
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size,
    n_live_tup as row_count
FROM 
    pg_stat_user_tables
ORDER BY 
    pg_total_relation_size(relid) DESC;

-- List all tables with columns
SELECT 
    t.table_schema as schema,
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable
FROM 
    information_schema.tables t
JOIN 
    information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE 
    t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name, c.ordinal_position;

-- Foreign key relationships
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
ORDER BY
    tc.table_name;