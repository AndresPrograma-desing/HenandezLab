const { Router } = require('express');
const authRoutes = require('./auth.routes');
const employeeRoutes = require('./employee.routes');
const inventoryRoutes = require('./inventory.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
