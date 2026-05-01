const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);

router.get('/', taskController.getAllTasks);
router.post('/', requireRole('ADMIN'), taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', requireRole('ADMIN'), taskController.deleteTask);

module.exports = router;
