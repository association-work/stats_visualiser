import express from "express";
import { serviceMap } from "./config/services";

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
