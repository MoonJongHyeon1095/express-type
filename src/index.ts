import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { dataSource } from "./db/orm.connection";
dotenv.config();

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' 
:( process.env.NODE_ENV?.toString().trim().toLowerCase() == 'development' ) ? 'development'
: 'test';

const app: Express = express();
const port = process.env.PORT;

dataSource
    .initialize()
    .then(() => {
        console.log(`${process.env.NODE_ENV} Data Source has been initialized!`)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use("/", routes);

app.listen(port, () => {
  console.log(`${port}만큼 사랑해`);
});
