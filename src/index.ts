import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dotenv from "dotenv";
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
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/", routes);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`${port}만큼 사랑해`);
});
