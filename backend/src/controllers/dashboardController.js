const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const today = new Date();

    const [total, todo, inProgress, done, overdue] = await Promise.all([
      prisma.task.count({ where: { organizationId } }),
      prisma.task.count({ where: { organizationId, status: 'TODO' } }),
      prisma.task.count({ where: { organizationId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { organizationId, status: 'DONE' } }),
      prisma.task.count({
        where: {
          organizationId,
          status: { not: 'DONE' },
          dueDate: { lt: today }
        }
      })
    ]);

    res.json({
      success: true,
      data: { 
        totalTasks: total, 
        byStatus: {
          TODO: todo,
          IN_PROGRESS: inProgress,
          DONE: done
        },
        overdueTasks: overdue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
