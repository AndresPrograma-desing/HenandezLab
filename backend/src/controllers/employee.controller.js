const employeeModel = require('../models/employee.model');

async function getAll(req, res) {
  const employees = await employeeModel.findAll();
  res.json(employees);
}

async function getById(req, res) {
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Empleado no encontrado' });
  }
  res.json(employee);
}

async function create(req, res) {
  const { first_name, last_name, email } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'Nombre, apellido y correo son requeridos' });
  }
  const employee = await employeeModel.create(req.body);
  res.status(201).json(employee);
}

async function update(req, res) {
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Empleado no encontrado' });
  }
  const updated = await employeeModel.update(req.params.id, { ...employee, ...req.body });
  res.json(updated);
}

async function remove(req, res) {
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Empleado no encontrado' });
  }
  await employeeModel.remove(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
