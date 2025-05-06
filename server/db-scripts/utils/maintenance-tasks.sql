-- Database Maintenance Tasks
-- Collection of maintenance operations for periodic database health

-- Analyze all tables to update statistics
ANALYZE VERBOSE;

-- Vacuum all tables (recovers space and updates statistics)
VACUUM ANALYZE;

-- Show database size information
SELECT
    pg_database.datname as database_name,
    pg_size_pretty(pg_database_size(pg_database.datname)) as database_size
FROM
    pg_database
ORDER BY
    pg_database_size(pg_database.datname) DESC;

-- Show table sizes (including indexes)
SELECT
    table_schema || '.' || table_name as table_full_name,
    pg_size_pretty(pg_total_relation_size('"' || table_schema || '"."' || table_name || '"')) as total_size,
    pg_size_pretty(pg_relation_size('"' || table_schema || '"."' || table_name || '"')) as table_size,
    pg_size_pretty(pg_indexes_size('"' || table_schema || '"."' || table_name || '"')) as index_size,
    pg_size_pretty(pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') - 
                   pg_relation_size('"' || table_schema || '"."' || table_name || '"')) as external_size
FROM 
    information_schema.tables
WHERE 
    table_schema NOT IN ('pg_catalog', 'information_schema')
    AND table_schema NOT LIKE 'pg_toast%'
ORDER BY 
    pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') DESC
LIMIT 20;

-- Check for long-running queries
SELECT
    pid,
    now() - pg_stat_activity.query_start as duration,
    query,
    state
FROM
    pg_stat_activity
WHERE
    (now() - pg_stat_activity.query_start) > interval '5 minutes'
    AND state != 'idle'
    AND pid <> pg_backend_pid()
ORDER BY
    duration DESC;

-- Lock information
SELECT
    locktype,
    relation::regclass,
    mode,
    transactionid as tid,
    virtualtransaction as vtid,
    pid,
    granted
FROM
    pg_locks
ORDER BY
    relation;