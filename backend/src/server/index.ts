import "reflect-metadata";

require("dotenv").config();

import express, { Application } from "express";
import bodyParser = require("body-parser");
import helmet from "helmet";
import { router } from "./routes";
import { serviceMap } from "./config/services";

const app = express();

app.use(helmet());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(router);

process.on("uncaughtException", (e) => {
  console.error("Uncaught exception", e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection", e);
  throw e;
});

serviceMap.synchronizationService
  .start()
  .then((_) =>
    app.listen(process.env.PORT, (e) => {
      if (e) {
        console.error(e);
      } else {
        console.log(`Server listening on port ${process.env.PORT}`);
      }
    })
  )
  .catch((e) => {
    console.error(e);
  });
