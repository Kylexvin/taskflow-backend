import pool from '../config/db.js';

class DashboardController {
    static async getStats(req, res) {
        try {
            const result = await pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM projects) as total_projects,
                    (SELECT COUNT(*) FROM tasks) as total_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE status = 'todo') as todo_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE status = 'in_progress') as in_progress_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE status = 'review') as review_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE status = 'done') as done_tasks,
                    (SELECT COUNT(*) FROM tasks WHERE status = 'blocked') as blocked_tasks
            `);
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default DashboardController;