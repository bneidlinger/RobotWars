-- Robot Visuals Analysis
-- Shows statistics about robot visual component choices

-- This script assumes loadout_configs.visuals is a JSONB field with robot visual components

-- Analyze turret types used
SELECT
    visuals->>'turret.type' as turret_type,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 1) as percentage
FROM (
    SELECT jsonb_path_query(visuals, '$.turret.type') as visuals
    FROM loadout_configs
) as turret_types
GROUP BY
    turret_type
ORDER BY
    count DESC;

-- Analyze chassis types used
SELECT
    visuals->>'chassis.type' as chassis_type,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 1) as percentage
FROM (
    SELECT jsonb_path_query(visuals, '$.chassis.type') as visuals
    FROM loadout_configs
) as chassis_types
GROUP BY
    chassis_type
ORDER BY
    count DESC;

-- Analyze mobility types used
SELECT
    visuals->>'mobility.type' as mobility_type,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 1) as percentage
FROM (
    SELECT jsonb_path_query(visuals, '$.mobility.type') as visuals
    FROM loadout_configs
) as mobility_types
GROUP BY
    mobility_type
ORDER BY
    count DESC;

-- Analyze color usage (for turrets)
SELECT
    visuals->>'turret.color' as turret_color,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 1) as percentage
FROM (
    SELECT jsonb_path_query(visuals, '$.turret.color') as visuals
    FROM loadout_configs
) as turret_colors
GROUP BY
    turret_color
ORDER BY
    count DESC
LIMIT 20;

-- Most popular complete visual configurations
SELECT
    jsonb_build_object(
        'turret', jsonb_path_query(visuals, '$.turret.type'),
        'chassis', jsonb_path_query(visuals, '$.chassis.type'),
        'mobility', jsonb_path_query(visuals, '$.mobility.type')
    ) as visual_config,
    COUNT(*) as count
FROM
    loadout_configs
GROUP BY
    jsonb_build_object(
        'turret', jsonb_path_query(visuals, '$.turret.type'),
        'chassis', jsonb_path_query(visuals, '$.chassis.type'),
        'mobility', jsonb_path_query(visuals, '$.mobility.type')
    )
ORDER BY
    count DESC
LIMIT 10;