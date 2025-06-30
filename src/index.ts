import dotenv from "dotenv";
import express, { Express } from "express";
import { config } from "./config";
dotenv.config();
const app: Express = express();
const port = config.server.port;
const SERVER_START_MSG = `Express server started on port: ${port}`;

app.listen(port, () => {
  console.log(SERVER_START_MSG);
});
