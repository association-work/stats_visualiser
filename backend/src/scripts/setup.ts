import path from "path";
require("dotenv").config({
  path: path.resolve(__dirname, "./.env.job"),
});

import "reflect-metadata";
import { serviceMap } from "./config/services";

console.info("Start Database setup job");
serviceMap.setupJob.run().then(
  () => {
    console.info("Database setup job done");
  },
  (e) => {
    console.error(e);
  }
);
