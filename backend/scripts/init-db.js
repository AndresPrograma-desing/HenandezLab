require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  // Conectarse al servidor MySQL (sin base de datos específica, ya que el script la crea)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  console.log('Conectado a MySQL. Leyendo schema.sql...');
  const schemaPath = path.join(__dirname, '..', 'src', 'config', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Ejecutando sentencias SQL para crear base de datos y tablas...');
  await connection.query(sql);

  console.log('Base de datos y tablas creadas exitosamente.');
  await connection.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Error al inicializar la base de datos:', error);
  process.exit(1);
});
