import { 
    getAllTasks, 
    getTaskById, 
    getTasksByProject, 
    createTask, 
    updateTask, 
    deleteTask 
} from '../models/taskModel.js';

class TaskController {
    static async getAll(req, res) {
        try {
            const tasks = await getAllTasks();
            res.json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const task = await getTaskById(id);
            
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            
            res.json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getByProject(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await getTasksByProject(projectId);
            res.json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { title, description, status, priority, story_points, due_date, assignee_id, project_id } = req.body;
            const created_by = req.user.id;
            
            const newTask = await createTask(
                title, description, status, priority, story_points, due_date, assignee_id, project_id, created_by
            );
            
            res.status(201).json(newTask);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, status, priority, story_points, due_date, assignee_id } = req.body;
            
            const existingTask = await getTaskById(id);
            if (!existingTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            
            const updatedTask = await updateTask(
                id, title, description, status, priority, story_points, due_date, assignee_id
            );
            
            res.json(updatedTask);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            
            const existingTask = await getTaskById(id);
            if (!existingTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            
            await deleteTask(id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default TaskController;