const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardData = async (req, res) => {
  try {
    const [totalTasks, todoCount, inProgressCount, doneCount, overdueTasks, myTasks] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
      prisma.task.count({ 
        where: { 
          dueDate: { lt: new Date() },
          status: { not: 'DONE' }
        } 
      }),
      prisma.task.count({ where: { assignedToId: req.user.userId } })
    ]);

    res.json({
      success: true,
      data: {
        totalTasks,
        byStatus: {
          TODO: todoCount,
          IN_PROGRESS: inProgressCount,
          DONE: doneCount
        },
        overdueTasks,
        myTasks
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
