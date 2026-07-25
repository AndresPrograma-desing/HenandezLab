// Uso: node scripts/create-user.js "Nombre Apellido" correo@hernandezlab.com password123 admin
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function main() {
  const [name, email, password, role = 'admin'] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error('Uso: node scripts/create-user.js "Nombre" correo@dominio.com password [rol]');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
    name,
    email,
    passwordHash,
    role,
  ]);

  console.log(`Usuario creado: ${email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
