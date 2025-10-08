import express from "express";
import { serviceMap } from "./config/services";
import * as z from "zod";
import { validate } from "./validate";

export const router = express.Router();

router.get("/topic", async (req, resp, next) => {
  try {
    const data = await serviceMap.topicRepo.findAll();
    resp.send(data);
  } catch (e) {
    next(e);
  }
});

router.get("/topic/:id", async (req, resp, next) => {
  try {
    const data = await serviceMap.topicRepo.findById(req.params.id);

    resp.set("Content-Type", "application/json").send(data);
  } catch (e) {
    next(e);
  }
});

const schema = z.strictObject({
  topic: z.uuid(),
});

router.get(
  "/location",
  validate(schema, (req) => req.query),
  async (req, resp, next) => {
    try {
      const data = await serviceMap.locationRepo.getTreeByTopic(
        req.query["topic"] as string
      );

      resp.set("Content-Type", "application/json").send(data);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/location/:id",
  validate(schema, (req) => req.query),
  async (req, resp, next) => {
    try {
      const data = await serviceMap.locationRepo.getTreeById(
        req.query["topic"] as string,
        Number(req.params.id)
      );

      resp.set("Content-Type", "application/json").send(data);
    } catch (e) {
      next(e);
    }
  }
);
