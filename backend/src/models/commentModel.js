import pool from '../config/db.js';

export const getCommentsByTask = async (taskId) => {
    const result = await pool.query(`
        SELECT c.*, u.name as user_name, u.email as user_email
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.task_id = $1
        ORDER BY c.created_at ASC
    `, [taskId]);
    return result.rows;
};

export const createComment = async (content, task_id, user_id) => {
    const result = await pool.query(
        `INSERT INTO comments (content, task_id, user_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [content, task_id, user_id]
    );
    return result.rows[0];
};

export const deleteComment = async (id) => {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};