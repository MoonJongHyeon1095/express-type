import { DataSource } from "typeorm"
​import dotenv from 'dotenv';
dotenv.config()

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: false,
})