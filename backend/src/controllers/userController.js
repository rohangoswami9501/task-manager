const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const users = await prisma.user.findMany({
      where: { organizationId },
      select: { id: true, name: true, role: true }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers };
