import path from "path";
require("dotenv").config({
  path: path.resolve(__dirname, "./.env.job"),
});

import "reflect-metadata";
import { serviceMap } from "./config/services";

console.info("Start population data synchronization");
serviceMap.populationDataJob.run().then(
  () => {
    console.info("Population data synchronization job done");
  },
  (e) => {
    console.error(e);
  }
);
