const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(authenticate);

router.get('/', projectController.getAllProjects);
router.post('/', requireRole('ADMIN'), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.delete('/:id', requireRole('ADMIN'), projectController.deleteProject);

module.exports = router;
