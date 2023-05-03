import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    connectTimeout: 5000,
    connectionLimit: 10,
  });
  
export default pool