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
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'Nombre, apellido y correo son requeridos' });
  }

  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'El correo electrónico no es válido' });
  }

  // Validar que el teléfono no contenga letras si es provisto
  if (phone && /[a-zA-Z]/.test(phone)) {
    return res.status(400).json({ message: 'El número de teléfono no puede contener letras' });
  }

  try {
    const employee = await employeeModel.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ message: 'Error interno al crear el empleado' });
  }
}

async function update(req, res) {
  const { email, phone } = req.body;
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Empleado no encontrado' });
  }

  // Validar formato de correo electrónico si se edita
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido' });
    }
  }

  // Validar que el teléfono no contenga letras si es provisto
  if (phone && /[a-zA-Z]/.test(phone)) {
    return res.status(400).json({ message: 'El número de teléfono no puede contener letras' });
  }

  try {
    const updated = await employeeModel.update(req.params.id, { ...employee, ...req.body });
    res.json(updated);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ message: 'Error interno al actualizar el empleado' });
  }
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
