import { DataSource, DataSourceOptions } from "typeorm"
​import dotenv from 'dotenv';
dotenv.config()

// export const dataSource = new DataSource({
//     type: "mysql",
//     host: process.env.DB_HOST,
//     port: 3306,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: ["src/entity/*.js"],
//     logging: true,
//     synchronize: false,
// })

let dataSourceOptions;

switch(process.env.NODE_ENV) {
  case 'production':
    dataSourceOptions = {
      type: "mysql",
      host: process.env.DB_HOST?.toString(),
      port: 3306,
      username: process.env.DB_USER?.toString(),
      password: process.env.DB_PASSWORD?.toString(),
      database: process.env.DB_NAME?.toString(),
      entities: ["src/entity/*.js"],
      logging: false, // set to false in production
      synchronize: false,
    };
    break;
  case 'test':
    dataSourceOptions = {
      type: "mysql",
      host: process.env.DB_HOST?.toString(),
      port: 3306,
      username: process.env.DB_USER?.toString(),
      password: process.env.DB_PASSWORD?.toString(),
      database: process.env.DB_NAME?.toString(),
      entities: ["src/entity/*.js"],
      logging: false,
      synchronize: true, // set to true in test
    };
    break;
  default:
    dataSourceOptions = {
      type: "mysql",
      host: process.env.DB_HOST?.toString(),
      port: 3306,
      username: process.env.DB_USER?.toString(),
      password: process.env.DB_PASSWORD?.toString(),
      database: process.env.DB_NAME?.toString(),
      entities: ["src/entity/*.js"],
      logging: true, 
      synchronize: true, 
    };
}

export const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);
