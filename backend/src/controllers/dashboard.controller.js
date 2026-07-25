const employeeModel = require('../models/employee.model');
const inventoryModel = require('../models/inventory.model');

async function getStats(req, res) {
  const [totalEmployees, onVacation, criticalItems] = await Promise.all([
    employeeModel.countActive(),
    employeeModel.countOnVacation(),
    inventoryModel.countCritical(),
  ]);

  res.json({ totalEmployees, onVacation, criticalItems });
}

module.exports = { getStats };
