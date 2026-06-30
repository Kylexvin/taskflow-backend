import pool from '../config/db.js';

export const getAllProjects = async () => {
    const result = await pool.query(`
        SELECT p.*, u.name as created_by_name 
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        ORDER BY p.created_at DESC
    `);
    return result.rows;
};

export const getProjectById = async (id) => {
    const result = await pool.query(`
        SELECT p.*, u.name as created_by_name 
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.id = $1
    `, [id]);
    return result.rows[0];
};

export const createProject = async (name, description, status, priority, start_date, end_date, created_by) => {
    const result = await pool.query(
        `INSERT INTO projects (name, description, status, priority, start_date, end_date, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [name, description, status || 'planning', priority || 'medium', start_date, end_date, created_by]
    );
    return result.rows[0];
};

export const updateProject = async (id, name, description, status, priority, start_date, end_date) => {
    const result = await pool.query(
        `UPDATE projects 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             status = COALESCE($3, status),
             priority = COALESCE($4, priority),
             start_date = COALESCE($5, start_date),
             end_date = COALESCE($6, end_date),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 
         RETURNING *`,
        [name, description, status, priority, start_date, end_date, id]
    );
    return result.rows[0];
};

export const deleteProject = async (id) => {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};