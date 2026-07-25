const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const { first_name, last_name, email, phone, position, department, hire_date, status } = data;
  const [result] = await pool.query(
    `INSERT INTO employees (first_name, last_name, email, phone, position, department, hire_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, phone, position, department, hire_date, status || 'activo']
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const { first_name, last_name, email, phone, position, department, hire_date, status } = data;
  await pool.query(
    `UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?,
     position = ?, department = ?, hire_date = ?, status = ? WHERE id = ?`,
    [first_name, last_name, email, phone, position, department, hire_date, status, id]
  );
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM employees WHERE id = ?', [id]);
}

async function countActive() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM employees WHERE status = 'activo'"
  );
  return rows[0].total;
}

async function countOnVacation() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM employees WHERE status = 'vacaciones'"
  );
  return rows[0].total;
}

module.exports = { findAll, findById, create, update, remove, countActive, countOnVacation };
