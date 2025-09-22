import path from "path";
require("dotenv").config({
  path: path.resolve(__dirname, "./.env.job"),
});

import "reflect-metadata";
import { serviceMap } from "./config/services";

console.info("Start Geo data synchronization");
serviceMap.geoJob.run().then(
  () => {
    console.info("Geo data synchronization job done");
  },
  (e) => {
    console.error(e);
  }
);
