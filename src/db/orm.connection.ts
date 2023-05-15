import { DataSource, DataSourceOptions } from "typeorm"
​import dotenv from 'dotenv';
dotenv.config()
import { Migrant } from "../entity/migrant.entity";
import { Address } from "../entity/address.entity";
import { Image } from "../entity/image.entity";

let dataSourceOptions;

switch(process.env.NODE_ENV) {
  case 'production':
    dataSourceOptions = {
      type: "mysql",
      host: process.env.PROD_HOST?.toString(),
      port: 3306,
      username: process.env.PROD_USER?.toString(),
      password: process.env.PROD_PASSWORD?.toString(),
      database: process.env.DB_NAME?.toString(),
      entities: [Migrant, Address, Image],
      // entities: [Migrant, Address, Image],
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
      entities: [Migrant, Address, Image],
      // entities: ["src/entity/*.ts"],
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
      entities: [Migrant, Address, Image],
      // entities: ["src/entity/*.ts"],
      logging: true, 
      synchronize: true, 
    };
}

export const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);
