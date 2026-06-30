import { getCommentsByTask, createComment, deleteComment } from '../models/commentModel.js';

class CommentController {
    static async getByTask(req, res) {
        try {
            const { taskId } = req.params;
            const comments = await getCommentsByTask(taskId);
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { content, task_id } = req.body;
            const user_id = req.user.id;
            
            const newComment = await createComment(content, task_id, user_id);
            res.status(201).json(newComment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            
            const result = await deleteComment(id);
            if (!result) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default CommentController;