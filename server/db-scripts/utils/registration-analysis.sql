-- User Registration Analysis
-- Shows registration patterns and user growth over time

-- User registrations by day
SELECT
    DATE_TRUNC('day', created_at) as registration_date,
    COUNT(*) as registrations
FROM
    users
GROUP BY
    DATE_TRUNC('day', created_at)
ORDER BY
    registration_date DESC;

-- User registrations by month
SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
    COUNT(*) as registrations,
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as cumulative_users
FROM
    users
GROUP BY
    DATE_TRUNC('month', created_at)
ORDER BY
    DATE_TRUNC('month', created_at);

-- Registration time analysis (hour of day)
SELECT
    EXTRACT(HOUR FROM created_at) as hour_of_day,
    COUNT(*) as registrations
FROM
    users
GROUP BY
    hour_of_day
ORDER BY
    hour_of_day;

-- Registration day of week analysis
SELECT
    TO_CHAR(created_at, 'Day') as day_of_week,
    COUNT(*) as registrations
FROM
    users
GROUP BY
    TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY
    EXTRACT(DOW FROM created_at);