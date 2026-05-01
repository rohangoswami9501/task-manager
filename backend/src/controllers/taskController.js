const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res) => {
  try {
    const { status, projectId, assignedToId, overdue } = req.query;
    
    let where = {};
    if (status) where.status = status;
    if (projectId) where.projectId = parseInt(projectId);
    if (assignedToId) where.assignedToId = parseInt(assignedToId);
    
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'DONE' };
    }

    const tasks = await prisma.task.findMany({ 
      where,
      include: {
        project: { select: { name: true } },
        assignedTo: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assignedToId } = req.body;
    
    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Title and projectId are required' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null
      }
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);
    const updates = req.body;
    
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (req.user.role === 'MEMBER') {
      if (task.assignedToId !== req.user.userId) {
        return res.status(403).json({ success: false, message: 'Forbidden. You can only update your assigned tasks.' });
      }
      
      const { status } = updates;
      if (!status) {
         return res.status(400).json({ success: false, message: 'Members can only update task status.' });
      }
      
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status }
      });
      return res.json({ success: true, data: updatedTask });
    }

    // ADMIN can update all fields
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
    if (updates.projectId) updates.projectId = parseInt(updates.projectId);
    if (updates.assignedToId) updates.assignedToId = parseInt(updates.assignedToId);

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updates
    });
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);
    
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
