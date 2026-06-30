import { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
} from '../models/projectModel.js';

class ProjectController {
    static async getAll(req, res) {
        try {
            const projects = await getAllProjects();
            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const project = await getProjectById(id);
            
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            res.json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { name, description, status, priority, start_date, end_date } = req.body;
            const created_by = req.user.id;
            
            const newProject = await createProject(
                name, description, status, priority, start_date, end_date, created_by
            );
            
            res.status(201).json(newProject);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, status, priority, start_date, end_date } = req.body;
            
            const existingProject = await getProjectById(id);
            if (!existingProject) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            const updatedProject = await updateProject(
                id, name, description, status, priority, start_date, end_date
            );
            
            res.json(updatedProject);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            
            const existingProject = await getProjectById(id);
            if (!existingProject) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            await deleteProject(id);
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default ProjectController;