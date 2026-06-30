import pool from '../config/db.js';

export const createUser = async (email, passwordHash, name, role = 'user') => {
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role) 
         VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at`,
        [email, passwordHash, name, role]
    );
    return result.rows[0];
};

export const findByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

export const findById = async (id) => {
    const result = await pool.query(
        'SELECT id, email, name, role, avatar_url, is_active, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

export const updateUser = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    
    const result = await pool.query(
        `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING id, email, name, role`,
        [id, ...values]
    );
    return result.rows[0];
};

export const deleteUser = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
};