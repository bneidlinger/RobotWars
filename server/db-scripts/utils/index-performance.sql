-- Index Performance Analysis
-- Identify unused or underused indexes

-- Find unused indexes
SELECT
    schemaname || '.' || relname as table,
    indexrelname as index,
    pg_size_pretty(pg_relation_size(i.indexrelid)) as index_size,
    idx_scan as index_scans
FROM 
    pg_stat_user_indexes ui
JOIN 
    pg_index i ON ui.indexrelid = i.indexrelid
WHERE 
    NOT indisunique AND idx_scan < 50
ORDER BY 
    pg_relation_size(i.indexrelid) DESC;

-- List all indexes with their usage statistics
SELECT
    schemaname as schema,
    relname as table_name,
    indexrelname as index_name,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM
    pg_stat_user_indexes
ORDER BY
    idx_scan DESC;