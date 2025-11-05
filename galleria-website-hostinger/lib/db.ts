
import mysql from 'mysql2/promise';
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT } = process.env;
export const pool = mysql.createPool({
  host: DB_HOST!, user: DB_USER!, password: DB_PASS!, database: DB_NAME!,
  port: Number(DB_PORT || 3306), waitForConnections: true, connectionLimit: 5, queueLimit: 0,
});
