-- Session Table Maintenance
-- Scripts to clean up expired sessions and analyze session usage

-- Delete expired sessions (more than 30 days old)
DELETE FROM session
WHERE expired < (NOW() - INTERVAL '30 days');

-- Session statistics
SELECT
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE expired > NOW()) as active_sessions,
    COUNT(*) FILTER (WHERE expired <= NOW()) as expired_sessions,
    MIN(expired) as oldest_expiry,
    MAX(expired) as newest_expiry,
    pg_size_pretty(pg_total_relation_size('session')) as table_size
FROM
    session;

-- Session age distribution
SELECT
    CASE
        WHEN expired > NOW() THEN 'active'
        WHEN expired > NOW() - INTERVAL '1 day' THEN '<1 day'
        WHEN expired > NOW() - INTERVAL '7 days' THEN '1-7 days'
        WHEN expired > NOW() - INTERVAL '30 days' THEN '7-30 days'
        ELSE '>30 days'
    END as session_age,
    COUNT(*) as count
FROM
    session
GROUP BY
    session_age
ORDER BY
    CASE session_age
        WHEN 'active' THEN 0
        WHEN '<1 day' THEN 1
        WHEN '1-7 days' THEN 2
        WHEN '7-30 days' THEN 3
        ELSE 4
    END;