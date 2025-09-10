import path from "path";
require("dotenv").config({
  path: path.resolve(__dirname, "./.env.job"),
});

import "reflect-metadata";
import { serviceMap } from "./config/services";

console.info("Start GES data synchronization");
serviceMap.gesDataJob.run().then(
  () => {
    console.info("GES data synchronization job done");
  },
  (e) => {
    console.error(e);
  }
);

process.on("uncaughtException", (e) => {
  console.error("Uncaught exception", e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection", e);
  throw e;
});
