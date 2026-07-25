const inventoryModel = require('../models/inventory.model');

async function getAll(req, res) {
  const items = await inventoryModel.findAll();
  res.json(items);
}

async function getById(req, res) {
  const item = await inventoryModel.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Ítem no encontrado' });
  }
  res.json(item);
}

async function create(req, res) {
  const { name, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Nombre y categoría son requeridos' });
  }
  const item = await inventoryModel.create(req.body);
  res.status(201).json(item);
}

async function update(req, res) {
  const item = await inventoryModel.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Ítem no encontrado' });
  }
  const updated = await inventoryModel.update(req.params.id, { ...item, ...req.body });
  res.json(updated);
}

async function remove(req, res) {
  const item = await inventoryModel.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Ítem no encontrado' });
  }
  await inventoryModel.remove(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
