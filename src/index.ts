import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
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
