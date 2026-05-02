const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
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
      data: { total, todo, inProgress, done, overdue }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
