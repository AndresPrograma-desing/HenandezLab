const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/stats', authMiddleware, dashboardController.getStats);

module.exports = router;
