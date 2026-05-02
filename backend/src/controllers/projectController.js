const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProjects = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const projects = await prisma.project.findMany({
      where: { organizationId },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } }
      }
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { organizationId } = req.user;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        organizationId
      }
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    // Ensure project belongs to the organization
    const project = await prisma.project.findFirst({
      where: { id: parseInt(id), organizationId }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProjects, createProject, deleteProject };
