import User from "../models/usersModel.js";
import Project from "../models/projects.js";

export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({
            name,
            description,
            user: req.user._id,
        });
        await project.save();
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        let project = await Project.findOne({ _id: req.params.id, user: req.user._id });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        project.name = name;
        project.description = description;
        await project.save();
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteProject = async (req, res) => {
    try {
        let project = await Project.findOne({ _id: req.params.id, user: req.user._id });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        await project.delete();
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

