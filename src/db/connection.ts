import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()

let connectionOptions;

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     connectTimeout: 5000,
//     connectionLimit: 10,
//   });

switch(process.env.NODE_ENV){
  case 'production' : 
    connectionOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      connectTimeout: 5000,
      connectionLimit: 10,
    }
    break;
  
  case 'test' : 
  connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.TEST_DB,
    password: process.env.DB_PASSWORD,
    connectTimeout: 5000,
    connectionLimit: 10,
  }
  break;

  default :
  connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    connectTimeout: 5000,
    connectionLimit: 10,
  }
}

const pool = mysql.createPool(connectionOptions)

export default pool