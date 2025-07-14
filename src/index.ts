import dotenv from "dotenv";
import { config } from "./config";
import { connectMongo } from './utils/prismaclient';
dotenv.config();
import app from "./server";
const port = config.server.port;
const SERVER_START_MSG = `Express server started on port: ${port}`;

(async () => {
  await connectMongo();
  app.listen(port, () => {
    console.log(SERVER_START_MSG);
  });
})();
