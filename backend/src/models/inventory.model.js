const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM inventory_items ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM inventory_items WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const { name, category, quantity, unit, min_stock, expiration_date } = data;
  const [result] = await pool.query(
    `INSERT INTO inventory_items (name, category, quantity, unit, min_stock, expiration_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, quantity || 0, unit || 'unidad', min_stock || 0, expiration_date || null]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const { name, category, quantity, unit, min_stock, expiration_date } = data;
  await pool.query(
    `UPDATE inventory_items SET name = ?, category = ?, quantity = ?, unit = ?,
     min_stock = ?, expiration_date = ? WHERE id = ?`,
    [name, category, quantity, unit, min_stock, expiration_date, id]
  );
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM inventory_items WHERE id = ?', [id]);
}

async function countCritical() {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM inventory_items WHERE quantity <= min_stock'
  );
  return rows[0].total;
}

module.exports = { findAll, findById, create, update, remove, countCritical };
