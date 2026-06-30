import pool from '../config/db.js';

export const getAllTasks = async () => {
    const result = await pool.query(`
        SELECT 
            t.*,
            assignee.name as assignee_name,
            creator.name as created_by_name,
            p.name as project_name
        FROM tasks t
        LEFT JOIN users assignee ON t.assignee_id = assignee.id
        LEFT JOIN users creator ON t.created_by = creator.id
        LEFT JOIN projects p ON t.project_id = p.id
        ORDER BY t.created_at DESC
    `);
    return result.rows;
};

export const getTaskById = async (id) => {
    const result = await pool.query(`
        SELECT 
            t.*,
            assignee.name as assignee_name,
            creator.name as created_by_name,
            p.name as project_name
        FROM tasks t
        LEFT JOIN users assignee ON t.assignee_id = assignee.id
        LEFT JOIN users creator ON t.created_by = creator.id
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.id = $1
    `, [id]);
    return result.rows[0];
};

export const getTasksByProject = async (projectId) => {
    const result = await pool.query(`
        SELECT 
            t.*,
            assignee.name as assignee_name,
            creator.name as created_by_name
        FROM tasks t
        LEFT JOIN users assignee ON t.assignee_id = assignee.id
        LEFT JOIN users creator ON t.created_by = creator.id
        WHERE t.project_id = $1
        ORDER BY t.created_at DESC
    `, [projectId]);
    return result.rows;
};

export const createTask = async (title, description, status, priority, story_points, due_date, assignee_id, project_id, created_by) => {
    const result = await pool.query(
        `INSERT INTO tasks 
         (title, description, status, priority, story_points, due_date, assignee_id, project_id, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [title, description, status || 'todo', priority || 'medium', story_points, due_date, assignee_id, project_id, created_by]
    );
    return result.rows[0];
};

export const updateTask = async (id, title, description, status, priority, story_points, due_date, assignee_id) => {
    const result = await pool.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             status = COALESCE($3, status),
             priority = COALESCE($4, priority),
             story_points = COALESCE($5, story_points),
             due_date = COALESCE($6, due_date),
             assignee_id = COALESCE($7, assignee_id),
             updated_at = CURRENT_TIMESTAMP,
             completed_at = CASE WHEN $3 = 'done' AND status != 'done' THEN CURRENT_TIMESTAMP 
                                 WHEN $3 = 'done' THEN completed_at 
                                 ELSE completed_at END
         WHERE id = $8 
         RETURNING *`,
        [title, description, status, priority, story_points, due_date, assignee_id, id]
    );
    return result.rows[0];
};

export const deleteTask = async (id) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};