const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTasks = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { projectId, status, assignedToId, overdue } = req.query;

    let where = { organizationId };

    if (projectId) where.projectId = parseInt(projectId);
    if (status) where.status = status;
    if (assignedToId) where.assignedToId = parseInt(assignedToId);
    
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'DONE' };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { name: true } },
        assignedTo: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { title, description, projectId, assignedToId, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: parseInt(projectId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        organizationId
      }
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;
    const updateData = req.body;

    // Security check: ensure task belongs to org
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), organizationId }
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    if (updateData.projectId) updateData.projectId = parseInt(updateData.projectId);
    if (updateData.assignedToId) updateData.assignedToId = parseInt(updateData.assignedToId);

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), organizationId }
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
