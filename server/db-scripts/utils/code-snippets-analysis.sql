-- Code Snippet Analysis
-- Shows statistics about user code snippets

-- Count of snippets per user
SELECT 
    u.username,
    COUNT(cs.id) as snippet_count,
    MIN(cs.created_at) as first_snippet_created,
    MAX(cs.created_at) as last_snippet_created
FROM 
    users u
LEFT JOIN 
    code_snippets cs ON u.id = cs.user_id
GROUP BY 
    u.username
ORDER BY 
    snippet_count DESC;

-- Snippet size statistics (approximating by character count)
SELECT 
    u.username,
    cs.name as snippet_name,
    LENGTH(cs.code) as character_count,
    ROUND(LENGTH(cs.code)::numeric / 400, 1) as approximate_kb_size,
    (LENGTH(cs.code) - LENGTH(REPLACE(cs.code, E'\n', ''))) / 
        CASE WHEN LENGTH(REPLACE(cs.code, E'\n', '')) = 0 THEN 1 
        ELSE LENGTH(REPLACE(cs.code, E'\n', '')) END::numeric 
        * 100 as whitespace_percentage
FROM 
    code_snippets cs
JOIN 
    users u ON cs.user_id = u.id
ORDER BY 
    character_count DESC;

-- Most common snippet names
SELECT 
    name,
    COUNT(*) as occurrences
FROM 
    code_snippets
GROUP BY 
    name
HAVING 
    COUNT(*) > 1
ORDER BY 
    occurrences DESC;

-- Code features detection (basic)
SELECT 
    u.username,
    cs.name,
    CASE WHEN cs.code LIKE '%function%' THEN 'Yes' ELSE 'No' END as uses_functions,
    CASE WHEN cs.code LIKE '%if %' OR cs.code LIKE '%if(%' THEN 'Yes' ELSE 'No' END as uses_conditionals,
    CASE WHEN cs.code LIKE '%for %' OR cs.code LIKE '%for(%' THEN 'Yes' ELSE 'No' END as uses_for_loops,
    CASE WHEN cs.code LIKE '%while %' OR cs.code LIKE '%while(%' THEN 'Yes' ELSE 'No' END as uses_while_loops,
    CASE WHEN cs.code LIKE '%console.log%' THEN 'Yes' ELSE 'No' END as uses_logging,
    CASE WHEN cs.code LIKE '%robot.scan%' THEN 'Yes' ELSE 'No' END as uses_scanning,
    CASE WHEN cs.code LIKE '%robot.fire%' THEN 'Yes' ELSE 'No' END as uses_firing,
    CASE WHEN cs.code LIKE '%robot.drive%' THEN 'Yes' ELSE 'No' END as uses_driving
FROM 
    code_snippets cs
JOIN 
    users u ON cs.user_id = u.id
ORDER BY 
    u.username;