import express from "express";
import { serviceMap } from "./config/services";

export const router = express.Router();

router.get("/topic", async (req, resp, next) => {
  try {
    const data = await serviceMap.repository.findAll();
    resp.send(data);
  } catch (e) {
    next(e);
  }
});

router.get("/topic/:id", async (req, resp, next) => {
  try {
    const data = await serviceMap.repository.findById(req.params.id);

    resp.set("Content-Type", "application/json").send(data);
  } catch (e) {
    next(e);
  }
});
